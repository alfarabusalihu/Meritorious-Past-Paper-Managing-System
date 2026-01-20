import { useState, useEffect } from 'react'
import { usersApi } from '../../lib/firebase/users'
import { configsApi, FilterConfig, SocialConfig, DonationConfig } from '../../lib/firebase/configs'
import { donationsApi } from '../../lib/firebase/donations'
import { UserProfile, Contribution } from '../../lib/firebase/schema'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Tabs, Tab, Box, Snackbar, Alert } from '@mui/material'
import { People, Settings, Save, Lock, LockOpen, Shield, AttachMoney, LocalCafe, SwapHoriz } from '@mui/icons-material'
import { useAuth } from '../../context/AuthContext'

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
                <Box sx={{ p: 3 }}>
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
    const [filters, setFilters] = useState<FilterConfig | null>(null)
    const [socials, setSocials] = useState<SocialConfig | null>(null)
    const [donations, setDonations] = useState<Contribution[]>([])
    const [donationConfig, setDonationConfig] = useState<DonationConfig>({ coffeePrice: 5, enabled: true })
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
            setFilters(f)
            setSocials(s)
            setDonations(d)
            setDonationConfig(dc)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handleToggleBlock = async (uid: string, blocked: boolean) => {
        await usersApi.toggleBlockUser(uid, blocked)
        setUsers(users.map(u => u.uid === uid ? { ...u, blocked } : u))
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
        if (!filters) return
        setLoading(true)
        try {
            await configsApi.updateFilters(filters)
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

    const updateFilterList = (key: keyof FilterConfig, value: string) => {
        if (!filters) return
        const list = value.split(',').map(s => s.trim()).filter(Boolean)
        setFilters({ ...filters, [key]: list })
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
        <div className="bg-white p-6 min-h-[600px]">
            <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} centered variant="fullWidth">
                <Tab icon={<People />} label="User Management" sx={{ fontWeight: 700 }} />
                <Tab icon={<Settings />} label="System Config" sx={{ fontWeight: 700 }} />
                <Tab icon={<LocalCafe />} label="Donations" sx={{ fontWeight: 700 }} />
            </Tabs>

            <TabPanel value={tabValue} index={0}>
                <div className="space-y-4 pb-8">
                    <h3 className="text-xl font-bold text-secondary mb-4">Registered Users</h3>
                    <div className="grid gap-4">
                        {users.map(user => (
                            <div key={user.uid} className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-muted">
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-full ${user.role === 'admin' ? 'bg-primary/20 text-primary' : user.role === 'super-admin' ? 'bg-secondary/20 text-secondary' : 'bg-muted text-muted-foreground'}`}>
                                        {user.role === 'admin' || user.role === 'super-admin' ? <Shield /> : <People />}
                                    </div>
                                    <div>
                                        <p className="font-bold text-foreground">{user.displayName || 'Unknown User'}</p>
                                        <p className="text-xs font-medium text-muted-foreground">{user.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {user.role !== 'super-admin' && (
                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            onClick={() => handleTransferOwnership(user.uid)}
                                            className="border-primary text-primary hover:bg-primary/10"
                                            title="Make Super Admin"
                                        >
                                            <SwapHoriz sx={{ fontSize: 16 }} />
                                        </Button>
                                    )}
                                    {user.role === 'user' && (
                                        <Button
                                            size="sm"
                                            onClick={() => handleToggleBlock(user.uid, !user.blocked)}
                                            className={user.blocked ? "bg-green-500 hover:bg-green-600" : "bg-destructive hover:bg-destructive/90"}
                                        >
                                            {user.blocked ? <LockOpen sx={{ fontSize: 16, marginRight: 1 }} /> : <Lock sx={{ fontSize: 16, marginRight: 1 }} />}
                                            {user.blocked ? 'Unblock' : 'Block'}
                                        </Button>
                                    )}
                                    <span className={`text-xs font-bold uppercase tracking-widest px-2 py-1 rounded ${user.role === 'super-admin' ? 'bg-secondary text-secondary-foreground' : 'bg-muted text-muted-foreground'
                                        }`}>
                                        {user.role}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
                <div className="space-y-8 pb-8">
                    <div>
                        <h3 className="text-xl font-bold text-secondary mb-4">Global Filters</h3>
                        <p className="text-sm text-muted-foreground mb-4">Comma-separated values for dropdowns.</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {filters && Object.keys(filters).map((key) => (
                                <div key={key}>
                                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1 block">{key}</label>
                                    <textarea
                                        className="w-full rounded-xl border-muted bg-muted/10 p-3 text-sm font-medium focus:ring-2 focus:ring-primary/20 min-h-[80px]"
                                        value={(filters as any)[key].join(', ')}
                                        onChange={(e) => updateFilterList(key as keyof FilterConfig, e.target.value)}
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-end">
                            <Button onClick={handleSaveFilters} className="mt-8 font-bold px-12 h-14 rounded-2xl shadow-lg" isLoading={loading}>
                                <Save sx={{ fontSize: 20, marginRight: 1 }} /> Save Filter Config
                            </Button>
                        </div>
                    </div>

                    <div className="border-t border-muted pt-8">
                        <h3 className="text-xl font-bold text-secondary mb-4">Social Links</h3>
                        <div className="grid grid-cols-1 gap-4">
                            <Input label="Facebook" value={socials?.facebook || ''} onChange={e => setSocials({ ...socials!, facebook: e.target.value })} />
                            <Input label="Twitter" value={socials?.twitter || ''} onChange={e => setSocials({ ...socials!, twitter: e.target.value })} />
                            <Input label="Instagram" value={socials?.instagram || ''} onChange={e => setSocials({ ...socials!, instagram: e.target.value })} />
                        </div>
                        <div className="flex justify-end">
                            <Button onClick={handleSaveSocials} className="mt-8 font-bold px-12 h-14 rounded-2xl shadow-lg" isLoading={loading}>
                                <Save sx={{ fontSize: 20, marginRight: 1 }} /> Save Socials
                            </Button>
                        </div>
                    </div>
                </div>
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
                <div className="space-y-8 pb-8">
                    <div>
                        <h3 className="text-xl font-bold text-secondary mb-4">Donation History</h3>
                        <div className="overflow-x-auto rounded-xl border border-muted">
                            <table className="w-full text-sm">
                                <thead className="bg-muted/30 border-b border-muted">
                                    <tr>
                                        <th className="text-left p-4 font-bold uppercase tracking-wider text-xs text-muted-foreground">Date</th>
                                        <th className="text-left p-4 font-bold uppercase tracking-wider text-xs text-muted-foreground">Donor</th>
                                        <th className="text-left p-4 font-bold uppercase tracking-wider text-xs text-muted-foreground">Email</th>
                                        <th className="text-right p-4 font-bold uppercase tracking-wider text-xs text-muted-foreground">Coffees</th>
                                        <th className="text-right p-4 font-bold uppercase tracking-wider text-xs text-muted-foreground">Amount</th>
                                        <th className="text-center p-4 font-bold uppercase tracking-wider text-xs text-muted-foreground">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {donations.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="text-center p-8 text-muted-foreground">
                                                No donations yet
                                            </td>
                                        </tr>
                                    ) : (
                                        donations.map(donation => (
                                            <tr key={donation.id} className="border-b border-muted hover:bg-muted/10 transition-colors">
                                                <td className="p-4 font-medium">{new Date(donation.timestamp).toLocaleDateString()}</td>
                                                <td className="p-4 font-bold">{donation.donorName}</td>
                                                <td className="p-4 text-muted-foreground font-medium">{donation.email}</td>
                                                <td className="p-4 text-right font-bold">{donation.coffeeCount}</td>
                                                <td className="p-4 text-right font-bold text-lg">${donation.amount.toFixed(2)}</td>
                                                <td className="p-4 text-center">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${donation.status === 'succeeded' ? 'bg-green-100 text-green-700' :
                                                        donation.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                            'bg-destructive/10 text-destructive'
                                                        }`}>
                                                        {donation.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="border-t border-muted pt-8">
                        <h3 className="text-xl font-bold text-secondary mb-4 flex items-center gap-2">
                            <AttachMoney className="text-primary" />
                            Donation Settings
                        </h3>
                        <div className="bg-muted/20 rounded-2xl p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground block mb-2">Coffee Price (USD)</label>
                                    <Input
                                        type="number"
                                        value={donationConfig.coffeePrice || 5}
                                        onChange={e => setDonationConfig({ ...donationConfig, coffeePrice: parseFloat(e.target.value) })}
                                        min={1}
                                        step={0.5}
                                    />
                                </div>
                                <div className="flex items-end">
                                    <div className="p-6 bg-white rounded-xl border border-muted w-full">
                                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Total Raised</p>
                                        <p className="text-3xl font-bold text-primary">${donations.reduce((sum, d) => sum + d.amount, 0).toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end pt-4">
                                <Button onClick={handleSaveDonationConfig} className="font-bold px-12 h-14 rounded-2xl shadow-lg" isLoading={loading}>
                                    <Save sx={{ fontSize: 20, marginRight: 1 }} /> Save Donation Settings
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
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
