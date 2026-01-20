import { Coffee, CheckCircle } from 'lucide-react'

interface DonationPitchProps {
    coffeePrice: number;
    selectedDetail: number;
    setSelectedDetail: (val: number) => void;
    customAmount: string;
    setCustomAmount: (val: string) => void;
}

export function DonationPitch({
    coffeePrice,
    selectedDetail,
    setSelectedDetail,
    customAmount,
    setCustomAmount
}: DonationPitchProps) {
    return (
        <div className="space-y-8 lg:sticky lg:top-32">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100/50 text-yellow-700 rounded-full font-bold text-xs uppercase tracking-widest">
                <Coffee size={14} strokeWidth={3} />
                Support The Project
            </div>

            <div className="space-y-4">
                <h1 className="text-5xl font-bold text-secondary leading-[1.1] tracking-tight">
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
                        <div className="font-bold text-2xl text-secondary-foreground">{count}</div>
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
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-muted/5 px-2 text-muted-foreground font-bold">Or custom amount</span></div>
            </div>

            <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">$</span>
                <input
                    type="number"
                    placeholder="Enter custom amount"
                    value={customAmount}
                    onChange={(e) => { setCustomAmount(e.target.value); setSelectedDetail(0); }}
                    className="w-full h-16 pl-10 pr-6 rounded-2xl border-2 border-muted bg-white text-xl font-bold focus:border-primary focus:ring-0 outline-none transition-all"
                />
            </div>
        </div>
    )
}
