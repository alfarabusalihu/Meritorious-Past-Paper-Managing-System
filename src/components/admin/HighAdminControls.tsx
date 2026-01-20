import { useState, useEffect } from 'react'
import { usersApi } from '../../lib/firebase/users'
import { configsApi, FilterConfig, SocialConfig, DonationConfig } from '../../lib/firebase/configs'
import { donationsApi } from '../../lib/firebase/donations'
import { UserProfile, Contribution } from '../../lib/firebase/schema'
import { Tabs, Tab, Box, Snackbar, Alert } from '@mui/material'
import { People, Settings, LocalCafe } from '@mui/icons-material'
import { useAuth } from '../../context/AuthContext'
import { UserManager } from './tabs/UserManager'
import { ConfigManager } from './tabs/ConfigManager'
import { DonationManager } from './tabs/DonationManager'

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
    return (
        <div role="tabpanel" hidden={value !== index} {...other}>
            {value === index && (
                <Box sx={{ p: { xs: 2, sm: 3 } }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

export function HighAdminControls() {
    const { user: currentUser } = useAuth()
    const [tabValue, setTabValue] = useState(0)
    const [users, setUsers] = useState<UserProfile[]>([])
    const [socials, setSocials] = useState<SocialConfig | null>(null)
    const [donations, setDonations] = useState<Contribution[]>([])
    const [donationConfig, setDonationConfig] = useState<DonationConfig>({ coffeePrice: 5, enabled: true })
    const [filterTexts, setFilterTexts] = useState<Record<string, string>>({})
    const [loading, setLoading] = useState(false)
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' })

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        setLoading(true)
        try {
            const [u, f, s, d, dc] = await Promise.all([
                usersApi.getAllUsers(),
                configsApi.getFilters(),
                configsApi.getSocials(),
                donationsApi.getContributions(),
                configsApi.getDonationSettings()
            ])
            setUsers(u)
            const texts: any = {}
            Object.keys(f).forEach(key => {
                texts[key] = f[key as keyof FilterConfig].join(', ')
            })
            setFilterTexts(texts)
            setSocials(s)
            setDonations(d)
            setDonationConfig(dc)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handleTransferOwnership = async (targetUid: string) => {
        if (!currentUser) return
        if (!window.confirm("Are you sure? You will lose Super Admin status.")) return

        setLoading(true)
        try {
            await usersApi.transferSuperAdmin(currentUser.uid, targetUid)
            setSnackbar({ open: true, message: 'Ownership transferred! Reloading...', severity: 'success' })
            setTimeout(() => window.location.reload(), 2000)
        } catch (error) {
            setSnackbar({ open: true, message: 'Transfer failed', severity: 'error' })
        } finally {
            setLoading(false)
        }
    }

    const handleSaveFilters = async () => {
        if (!filterTexts) return
        setLoading(true)
        try {
            const newFilters: any = {}
            Object.keys(filterTexts).forEach(key => {
                newFilters[key] = filterTexts[key].split(',').map(s => s.trim()).filter(Boolean)
            })
            await configsApi.updateFilters(newFilters as FilterConfig)
            setSnackbar({ open: true, message: 'Filters updated successfully!', severity: 'success' })
        } catch (error) {
            setSnackbar({ open: true, message: 'Failed to update filters', severity: 'error' })
        } finally {
            setLoading(false)
        }
    }

    const handleSaveSocials = async () => {
        if (!socials) return
        setLoading(true)
        try {
            await configsApi.updateSocials(socials)
            setSnackbar({ open: true, message: 'Social links updated successfully!', severity: 'success' })
        } catch (error) {
            setSnackbar({ open: true, message: 'Failed to update social links', severity: 'error' })
        } finally {
            setLoading(false)
        }
    }

    const handleSaveDonationConfig = async () => {
        setLoading(true)
        try {
            await configsApi.updateDonationSettings(donationConfig)
            setSnackbar({ open: true, message: 'Donation settings updated successfully!', severity: 'success' })
        } catch (error) {
            setSnackbar({ open: true, message: 'Failed to update donation settings', severity: 'error' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-white min-h-[500px]">
            <div className="border-b border-muted bg-muted/10 sticky top-0 z-30">
                <Tabs
                    value={tabValue}
                    onChange={(_, v) => setTabValue(v)}
                    variant="scrollable"
                    scrollButtons="auto"
                    allowScrollButtonsMobile
                    sx={{
                        '& .MuiTab-root': {
                            minHeight: 64,
                            textTransform: 'none',
                            fontWeight: 700,
                            fontSize: '0.9rem'
                        }
                    }}
                >
                    <Tab icon={<People />} label="Users" iconPosition="start" />
                    <Tab icon={<Settings />} label="Config" iconPosition="start" />
                    <Tab icon={<LocalCafe />} label="Donations" iconPosition="start" />
                </Tabs>
            </div>

            <TabPanel value={tabValue} index={0}>
                <UserManager
                    users={users}
                    currentUserUid={currentUser?.uid || ''}
                    onUserUpdate={(uid, blocked) => setUsers(users.map(u => u.uid === uid ? { ...u, blocked } : u))}
                    onTransferOwnership={handleTransferOwnership}
                />
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
                <ConfigManager
                    filterTexts={filterTexts}
                    socials={socials}
                    loading={loading}
                    onUpdateFilterList={(key, value) => setFilterTexts(prev => ({ ...prev, [key]: value }))}
                    onUpdateSocials={setSocials}
                    onSaveFilters={handleSaveFilters}
                    onSaveSocials={handleSaveSocials}
                    onSnackbar={(message, severity) => setSnackbar({ open: true, message, severity })}
                />
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
                <DonationManager
                    donations={donations}
                    donationConfig={donationConfig}
                    loading={loading}
                    onUpdateDonationConfig={setDonationConfig}
                    onSaveDonationConfig={handleSaveDonationConfig}
                />
            </TabPanel>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    sx={{ borderRadius: '1rem', fontWeight: 700 }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </div>
    )
}
