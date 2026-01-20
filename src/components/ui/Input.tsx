import React from 'react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, ...props }, ref) => {
        return (
            <div className="w-full space-y-1.5">
                {label && (
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 px-1">
                        {label}
                    </label>
                )}
                <input
                    className={cn(
                        'flex h-12 w-full rounded-2xl border-none bg-muted/30 px-4 py-2 text-sm font-bold placeholder:text-muted-foreground/40 focus:ring-2 focus:ring-primary/20 outline-none transition-all disabled:cursor-not-allowed disabled:opacity-50',
                        error && 'ring-2 ring-destructive/20',
                        className
                    )}
                    ref={ref}
                    {...props}
                />
                {error && <p className="text-xs text-destructive" role="alert">{error}</p>}
            </div>
        )
    }
)

Input.displayName = 'Input'
