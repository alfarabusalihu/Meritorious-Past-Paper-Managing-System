import { motion } from 'framer-motion'
import { CheckCircle, Download } from 'lucide-react'
import { Button } from '../ui/Button'
import { generateReceipt } from '../../lib/receipts'
import { Contribution } from '../../lib/firebase/schema'

interface DonationSuccessProps {
    successData: Contribution;
}

export function DonationSuccess({ successData }: DonationSuccessProps) {
    return (
        <div className="min-h-[80vh] flex items-center justify-center pt-20 pb-20 px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-8 text-center space-y-8 relative overflow-hidden"
            >
                <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-green-400 to-emerald-500" />

                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600 shadow-xl shadow-green-200/50">
                    <CheckCircle size={48} strokeWidth={3} />
                </div>

                <div className="space-y-2">
                    <h2 className="text-3xl font-bold text-secondary-foreground">Thank You!</h2>
                    <p className="text-muted-foreground font-medium">
                        Your contribution of <strong className="text-green-600">${successData.amount}</strong> helps us keep the lights on.
                    </p>
                </div>

                <div className="p-6 bg-muted/20 rounded-2xl border border-muted/50 space-y-4">
                    <div className="flex items-center justify-between text-sm font-bold">
                        <span className="text-muted-foreground">Receipt ID</span>
                        <span className="font-mono text-foreground">{successData.receiptId}</span>
                    </div>
                    <div className="border-t border-muted/50" />
                    <div className="flex items-center justify-between text-sm font-bold">
                        <span className="text-muted-foreground">Date</span>
                        <span className="text-foreground">{new Date().toLocaleDateString()}</span>
                    </div>
                </div>

                <div className="space-y-3">
                    <Button
                        className="w-full h-14 rounded-2xl font-bold shadow-lg bg-secondary text-white hover:bg-secondary/90"
                        onClick={() => generateReceipt(successData)}
                    >
                        <Download className="mr-2 h-5 w-5" />
                        Download Receipt Again
                    </Button>
                    <Button variant="ghost" className="w-full font-bold text-muted-foreground" onClick={() => window.location.reload()}>
                        Donate Again
                    </Button>
                </div>
            </motion.div>
        </div>
    )
}
