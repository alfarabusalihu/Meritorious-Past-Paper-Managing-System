import { FallbackProps } from 'react-error-boundary'
import { AlertCircle, RotateCcw, Home } from 'lucide-react'
import { Button } from './Button'
import { useNavigate } from 'react-router-dom'

export function ErrorPage({ error, resetErrorBoundary }: FallbackProps) {
    const navigate = useNavigate()
    const errorMessage = error instanceof Error ? error.message : String(error)

    return (
        <div className="min-h-[70vh] w-full flex items-center justify-center p-6">
            <div className="max-w-xl w-full bg-white rounded-[3rem] p-8 md:p-12 border border-muted shadow-2xl text-center space-y-8 animate-in zoom-in duration-500">
                <div className="w-24 h-24 bg-destructive/10 text-destructive rounded-[2rem] flex items-center justify-center mx-auto rotate-12 transition-transform hover:rotate-0 duration-500">
                    <AlertCircle size={48} />
                </div>

                <div className="space-y-3">
                    <h1 className="text-3xl md:text-4xl font-bold text-secondary tracking-tight">Something went wrong</h1>
                    <p className="text-muted-foreground font-medium text-lg italic">
                        "{errorMessage}"
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    {resetErrorBoundary && (
                        <Button
                            onClick={resetErrorBoundary}
                            className="flex-1 h-14 rounded-2xl font-bold text-lg gap-2"
                        >
                            <RotateCcw size={20} />
                            Try Again
                        </Button>
                    )}
                    <Button
                        variant="secondary"
                        onClick={() => {
                            if (resetErrorBoundary) resetErrorBoundary()
                            navigate('/')
                        }}
                        className="flex-1 h-14 rounded-2xl font-bold text-lg gap-2"
                    >
                        <Home size={20} />
                        Go Home
                    </Button>
                </div>

                <p className="text-[10px] text-muted-foreground/50 uppercase tracking-[0.2em] font-bold">
                    Ref Code: {Math.random().toString(36).substring(7).toUpperCase()}
                </p>
            </div>
        </div>
    )
}
