import { Contribution } from '../../../lib/firebase/schema'
import { DonationConfig } from '../../../lib/firebase/configs'
import { Button } from '../../ui/Button'
import { Input } from '../../ui/Input'
import { AttachMoney, Save } from '@mui/icons-material'

interface DonationManagerProps {
    donations: Contribution[];
    donationConfig: DonationConfig;
    loading: boolean;
    onUpdateDonationConfig: (config: DonationConfig) => void;
    onSaveDonationConfig: () => void;
}

export function DonationManager({
    donations,
    donationConfig,
    loading,
    onUpdateDonationConfig,
    onSaveDonationConfig
}: DonationManagerProps) {
    return (
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
                                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                        <td className="p-4 font-medium">{((donation.timestamp as any).toDate ? (donation.timestamp as any).toDate() : new Date(donation.timestamp as any)).toLocaleDateString()}</td>
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
                                onChange={e => onUpdateDonationConfig({ ...donationConfig, coffeePrice: parseFloat(e.target.value) })}
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
                    <div className="flex justify-end sticky bottom-0 bg-white/80 backdrop-blur-sm p-4 -mx-6 border-t border-muted/50 mt-4 rounded-b-2xl">
                        <Button onClick={onSaveDonationConfig} className="w-full sm:w-auto font-bold px-12 h-14 rounded-2xl shadow-lg" isLoading={loading}>
                            <Save sx={{ fontSize: 20, marginRight: 1 }} /> Save Donation Settings
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
