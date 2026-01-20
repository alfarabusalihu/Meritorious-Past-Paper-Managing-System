import { Loader2 } from 'lucide-react'

export function LoadingPage() {
    return (
        <div className="min-h-[60vh] w-full flex flex-col items-center justify-center space-y-6 animate-in fade-in duration-500">
            <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-pulse" />
                <Loader2 size={64} className="text-primary animate-spin relative z-10" />
            </div>
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-secondary">Loading Meritorious</h2>
                <p className="text-muted-foreground font-medium animate-bounce">Preparing your archive...</p>
            </div>
        </div>
    )
}
