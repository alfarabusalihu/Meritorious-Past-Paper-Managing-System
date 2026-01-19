import { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { motion } from 'framer-motion'
import { Coffee, Download, ShieldCheck, CreditCard, CheckCircle } from 'lucide-react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { donationsApi } from '../../lib/firebase/donations'
import { generateReceipt } from '../../lib/receipts'
import { configsApi } from '../../lib/firebase/configs'

// Initialize Stripe with public key (Test mode)
// If Env variable is missing, it will fail silently until provided, or we can fallback or error.
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_TYooMQauvdEDq54NiTphI7jx')

const CheckoutForm = ({ amount, coffeeCount, onSuccess }: { amount: number, coffeeCount: number, onSuccess: (details: any) => void }) => {
    const stripe = useStripe()
    const elements = useElements()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()

        if (!stripe || !elements) return

        setLoading(true)
        setError(null)

        const cardElement = elements.getElement(CardElement)

        if (!cardElement) {
            setLoading(false)
            return
        }

        // 1. Create Payment Method (Client Side)
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
            billing_details: {
                name: name,
                email: email
            }
        })

        if (error) {
            setError(error.message || 'Payment failed')
            setLoading(false)
        } else {
            console.log('[PaymentMethod]', paymentMethod)
            // 2. Mock Server Confirmation (Since we are serverless for this demo)
            // In a real app, you would send paymentMethod.id to your backend to create a PaymentIntent

            // Artificial delay to simulate processing
            setTimeout(async () => {
                const contribution = {
                    donorName: name || 'Anonymous',
                    email: email || 'anonymous@example.com',
                    amount: amount,
                    currency: 'usd',
                    status: 'succeeded' as const,
                    coffeeCount: coffeeCount,
                    receiptId: `RCPT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
                }

                // Save to Firestore
                const id = await donationsApi.addContribution(contribution)

                // Trigger success
                onSuccess({ ...contribution, id })
                setLoading(false)
            }, 1500)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
                <Input
                    label="Full Name"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <Input
                    label="Email Address"
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>

            <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Card Details</label>
                <div className="p-4 bg-white/50 border border-muted/50 rounded-xl focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                    <CardElement options={{
                        style: {
                            base: {
                                fontSize: '16px',
                                color: '#424770',
                                '::placeholder': {
                                    color: '#aab7c4',
                                },
                                fontWeight: '500',
                                fontFamily: 'Inter, system-ui, sans-serif'
                            },
                            invalid: {
                                color: '#9e2146',
                            },
                        },
                    }} />
                </div>
            </div>

            {error && (
                <div className="p-4 bg-destructive/10 text-destructive text-sm font-bold rounded-xl animate-in fade-in slide-in-from-top-2">
                    {error}
                </div>
            )}

            <Button
                type="submit"
                disabled={!stripe || loading}
                isLoading={loading}
                className="w-full h-14 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-[0.98]"
            >
                {loading ? 'Processing...' : `Donate $${amount}`}
                {!loading && <CreditCard className="ml-2 h-5 w-5" />}
            </Button>

            <div className="flex items-center justify-center gap-2 text-xs font-bold text-muted-foreground/60">
                <ShieldCheck size={14} className="text-green-500" />
                Payments secured by Stripe
            </div>
        </form>
    )
}

export function Contribute() {
    const [coffeePrice, setCoffeePrice] = useState(5)
    const [selectedDetail, setSelectedDetail] = useState(3) // Default 3 coffees
    const [customAmount, setCustomAmount] = useState('')
    const [successData, setSuccessData] = useState<any | null>(null)

    useEffect(() => {
        const fetchDefaults = async () => {
            const defaults = await configsApi.getDonationSettings()
            if (defaults.coffeePrice) setCoffeePrice(defaults.coffeePrice)
        }
        fetchDefaults()
    }, [])

    const handleSuccess = (data: any) => {
        setSuccessData(data)
        // Auto download receipt
        generateReceipt(data)
    }

    const currentAmount = customAmount ? parseFloat(customAmount) : (selectedDetail * coffeePrice)

    if (successData) {
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
                        <h2 className="text-3xl font-black text-secondary-foreground">Thank You!</h2>
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
                            className="w-full h-14 rounded-2xl font-black shadow-lg bg-secondary text-white hover:bg-secondary/90"
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

    return (
        <div className="min-h-screen pt-32 pb-20 px-4 bg-muted/5">
            <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                {/* Left Side: Pitch */}
                <div className="space-y-8 lg:sticky lg:top-32">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100/50 text-yellow-700 rounded-full font-black text-xs uppercase tracking-widest">
                        <Coffee size={14} strokeWidth={3} />
                        Support The Project
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-5xl font-black text-secondary leading-[1.1] tracking-tight">
                            Buy us a coffee,<br />
                            <span className="text-primary transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">fuel the mission.</span>
                        </h1>
                        <p className="text-lg text-muted-foreground font-medium leading-relaxed max-w-lg">
                            MPPMS is free and open-source. Your contributions help cover server costs and encourage further development of educational tools.
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        {[1, 3, 5].map(count => (
                            <button
                                key={count}
                                onClick={() => { setSelectedDetail(count); setCustomAmount(''); }}
                                className={`relative group p-6 rounded-[2rem] border-2 transition-all duration-300 ${selectedDetail === count && !customAmount ? 'border-primary bg-primary/5 shadow-xl shadow-primary/10 scale-105' : 'border-muted bg-white hover:border-primary/30 hover:shadow-lg'}`}
                            >
                                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">☕</div>
                                <div className="font-black text-2xl text-secondary-foreground">{count}</div>
                                <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground opacity-60">
                                    ${count * coffeePrice}
                                </div>
                                {selectedDetail === count && !customAmount && (
                                    <div className="absolute top-3 right-3 text-primary">
                                        <CheckCircle size={20} fill="currentColor" className="text-white" />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-muted"></span></div>
                        <div className="relative flex justify-center text-xs uppercase"><span className="bg-muted/5 px-2 text-muted-foreground font-black">Or custom amount</span></div>
                    </div>

                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-muted-foreground">$</span>
                        <input
                            type="number"
                            placeholder="Enter custom amount"
                            value={customAmount}
                            onChange={(e) => { setCustomAmount(e.target.value); setSelectedDetail(0); }}
                            className="w-full h-16 pl-10 pr-6 rounded-2xl border-2 border-muted bg-white text-xl font-black focus:border-primary focus:ring-0 outline-none transition-all"
                        />
                    </div>
                </div>

                {/* Right Side: Payment Form */}
                <div className="bg-white rounded-[2.5rem] shadow-xl border border-muted/50 p-8 lg:p-10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

                    <div className="mb-8 flex items-center justify-between">
                        <h3 className="text-2xl font-black text-secondary flex items-center gap-3">
                            <CreditCard className="text-primary" />
                            Payment Details
                        </h3>
                        <div className="text-right">
                            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Total to pay</p>
                            <p className="text-2xl font-black text-secondary-foreground">${currentAmount.toFixed(2)}</p>
                        </div>
                    </div>

                    <Elements stripe={stripePromise} options={{
                        appearance: {
                            theme: 'stripe',
                            variables: {
                                colorPrimary: '#3b82f6',
                                borderRadius: '12px',
                                fontFamily: 'Inter, system-ui, sans-serif'
                            }
                        }
                    }}>
                        <CheckoutForm
                            amount={currentAmount}
                            coffeeCount={selectedDetail || 1}
                            onSuccess={handleSuccess}
                        />
                    </Elements>
                </div>
            </div>
        </div>
    )
}
