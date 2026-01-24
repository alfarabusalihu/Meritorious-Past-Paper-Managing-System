import { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import { CreditCard } from 'lucide-react'
import { generateReceipt } from '../../lib/receipts'
import { configsApi } from '../../lib/firebase/configs'
import { CheckoutForm } from '../donation/CheckoutForm'
import { DonationPitch } from '../donation/DonationPitch'
import { DonationSuccess } from '../donation/DonationSuccess'
import { Contribution } from '../../lib/firebase/schema'
import { useLanguage } from '../../context/LanguageContext'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_TYooMQauvdEDq54NiTphI7jx')

export function Contribute() {
    const { t } = useLanguage()
    const [coffeePrice, setCoffeePrice] = useState(5)
    const [selectedDetail, setSelectedDetail] = useState(3)
    const [customAmount, setCustomAmount] = useState('')
    const [successData, setSuccessData] = useState<Contribution | null>(null)

    useEffect(() => {
        const fetchDefaults = async () => {
            const defaults = await configsApi.getDonationSettings()
            if (defaults.coffeePrice) setCoffeePrice(defaults.coffeePrice)
        }
        fetchDefaults()
    }, [])

    const handleSuccess = (data: Contribution) => {
        setSuccessData(data)
        generateReceipt(data)
    }

    const currentAmount = customAmount ? parseFloat(customAmount) : (selectedDetail * coffeePrice)

    if (successData) {
        return <DonationSuccess successData={successData} />
    }

    return (
        <div className="section-container page-header-padding pb-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                <DonationPitch
                    coffeePrice={coffeePrice}
                    selectedDetail={selectedDetail}
                    setSelectedDetail={setSelectedDetail}
                    customAmount={customAmount}
                    setCustomAmount={setCustomAmount}
                />

                {/* Right Side: Payment Form */}
                <div className="bg-white rounded-[2.5rem] shadow-xl border border-muted/50 p-8 lg:p-10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

                    <div className="mb-8 flex items-center justify-between">
                        <h3 className="text-2xl font-bold text-secondary flex items-center gap-3">
                            <CreditCard className="text-primary" />
                            {t('contribute.payment.title')}
                        </h3>
                        <div className="text-right">
                            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t('contribute.payment.total')}</p>
                            <p className="text-2xl font-bold text-secondary">${currentAmount.toFixed(2)}</p>
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
