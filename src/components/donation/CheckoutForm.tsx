import { useState } from 'react'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { CreditCard, ShieldCheck } from 'lucide-react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { donationsApi } from '../../lib/firebase/donations'

interface CheckoutFormProps {
    amount: number;
    coffeeCount: number;
    onSuccess: (details: any) => void;
}

export function CheckoutForm({ amount, coffeeCount, onSuccess }: CheckoutFormProps) {
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
            // Simulated delay for demo
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

                const id = await donationsApi.addContribution(contribution)
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
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Card Details</label>
                <div className="p-4 bg-white/50 border border-muted/50 rounded-xl focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                    <CardElement options={{
                        style: {
                            base: {
                                fontSize: '16px',
                                color: '#424770',
                                '::placeholder': { color: '#aab7c4' },
                                fontWeight: '500',
                                fontFamily: 'Inter, system-ui, sans-serif'
                            },
                            invalid: { color: '#9e2146' },
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
                className="w-full h-14 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-[0.98]"
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
