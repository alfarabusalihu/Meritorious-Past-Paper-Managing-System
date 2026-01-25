import { useState, useEffect } from 'react'
import { donationsApi } from '../../../lib/firebase/donations'
import { Contribution } from '../../../lib/firebase/schema'
import { generateReceipt } from '../../../lib/receipts'
import { Mail, Download, Search, User, CreditCard } from 'lucide-react'
import { Button } from '../../ui/Button'

interface DonationsTableProps {
    onSnackbar: (message: string, severity: 'success' | 'error') => void;
}

export function DonationsTable({ onSnackbar }: DonationsTableProps) {
    const [donations, setDonations] = useState<Contribution[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        fetchDonations()
    }, [])

    const fetchDonations = async () => {
        setLoading(true)
        try {
            const data = await donationsApi.getContributions()
            setDonations(data)
        } catch (error) {
            console.error(error)
            onSnackbar('Failed to load donations', 'error')
        } finally {
            setLoading(false)
        }
    }

    const handleSendEmail = (donation: Contribution) => {
        const subject = encodeURIComponent("Thank You for Your Contribution - Merit O/L Series");
        const body = encodeURIComponent(
            `Dear ${donation.donorName},\n\n` +
            `We have received your generous contribution of $${donation.amount.toFixed(2)} (${donation.coffeeCount} coffee(s)).\n` +
            `Your support is invaluable in helping us maintain and expand the Meritorious Past Paper Management System.\n\n` +
            `You can find your official receipt attached (if provided) or referenced by ID: ${donation.receiptId}.\n\n` +
            `With gratitude,\n` +
            `The Merit O/L Series Team`
        );
        window.location.href = `mailto:${donation.email}?subject=${subject}&body=${body}`;
    };

    const filteredDonations = donations.filter(d =>
        d.donorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.receiptId?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-20 gap-4">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent animate-spin rounded-full" />
                <span className="font-bold text-muted-foreground">Loading contributors...</span>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-muted/5 p-6 rounded-[2rem] border border-muted/50">
                <div>
                    <h3 className="text-xl font-bold text-secondary">Contribution Ledger</h3>
                    <p className="text-sm text-muted-foreground font-medium">View and manage support from your donors.</p>
                </div>
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input
                        type="text"
                        placeholder="Search donors..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-white border border-muted rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                </div>
            </div>

            <div className="overflow-x-auto rounded-[2rem] border border-muted bg-white">
                <table className="w-full border-collapse text-left">
                    <thead>
                        <tr className="bg-muted/5 border-b border-muted">
                            <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-muted-foreground w-1/4">Donor</th>
                            <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-muted-foreground">Amount</th>
                            <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-muted-foreground">Date</th>
                            <th className="px-12 py-4 text-xs font-black uppercase tracking-widest text-muted-foreground text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-muted">
                        {filteredDonations.length > 0 ? filteredDonations.map((donation) => (
                            <tr key={donation.id} className="hover:bg-muted/5 transition-colors group">
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                            <User size={20} />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="font-bold text-secondary truncate">{donation.donorName}</div>
                                            <div className="text-xs text-muted-foreground truncate">{donation.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-green-100 text-green-600 flex items-center justify-center">
                                            <CreditCard size={14} />
                                        </div>
                                        <span className="font-black text-secondary">${donation.amount.toFixed(2)}</span>
                                    </div>
                                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider ml-10">
                                        {donation.coffeeCount} {donation.coffeeCount === 1 ? 'Coffee' : 'Coffees'}
                                    </div>
                                </td>
                                <td className="px-6 py-5 text-sm font-bold text-muted-foreground">
                                    {donation.timestamp instanceof Date
                                        ? donation.timestamp.toLocaleDateString()
                                        : (donation.timestamp as any).toDate?.().toLocaleDateString() || 'N/A'}
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center justify-center gap-2">
                                        <Button
                                            variant="secondary"
                                            onClick={() => generateReceipt(donation)}
                                            className="h-10 px-4 rounded-xl text-xs font-bold gap-2"
                                        >
                                            <Download size={14} />
                                            <span className="hidden xl:inline">Receipt</span>
                                        </Button>
                                        <Button
                                            onClick={() => handleSendEmail(donation)}
                                            className="h-10 px-4 bg-primary text-white rounded-xl text-xs font-bold gap-2 shadow-lg shadow-primary/10"
                                        >
                                            <Mail size={14} />
                                            <span className="hidden xl:inline">Say Thanks</span>
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={4} className="px-6 py-20 text-center">
                                    <p className="text-muted-foreground font-medium">No contributors found matches your search.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
