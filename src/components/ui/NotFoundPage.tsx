import { useNavigate } from 'react-router-dom'
import { FileQuestion, Home } from 'lucide-react'
import { Button } from './Button'

export function NotFoundPage() {
    const navigate = useNavigate()

    return (
        <div className="min-h-[70vh] w-full flex items-center justify-center p-6">
            <div className="max-w-xl w-full bg-white rounded-[3rem] p-8 md:p-12 border border-muted shadow-2xl text-center space-y-8 animate-in zoom-in duration-500">
                <div className="w-24 h-24 bg-primary/10 text-primary rounded-[2rem] flex items-center justify-center mx-auto rotate-12 transition-transform hover:rotate-0 duration-500">
                    <FileQuestion size={48} />
                </div>

                <div className="space-y-3">
                    <h1 className="text-3xl md:text-4xl font-bold text-secondary tracking-tight">Page Not Found</h1>
                    <p className="text-muted-foreground font-medium text-lg text-balance">
                        The page you are looking for doesn't exist or has been moved.
                    </p>
                </div>

                <div className="flex justify-center">
                    <Button
                        onClick={() => navigate('/')}
                        className="h-14 rounded-2xl font-bold text-lg gap-2 px-8"
                    >
                        <Home size={20} />
                        Go Home
                    </Button>
                </div>
            </div>
        </div>
    )
}
