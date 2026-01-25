import React from 'react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
    startIcon?: React.ReactNode
    endIcon?: React.ReactNode
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, startIcon, endIcon, ...props }, ref) => {
        return (
            <div className="w-full space-y-1.5">
                {label && (
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 px-1">
                        {label}
                    </label>
                )}
                <div className="relative">
                    {startIcon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                            {startIcon}
                        </div>
                    )}
                    <input
                        className={cn(
                            'flex h-12 w-full rounded-2xl border border-muted-foreground/20 bg-muted/50 px-4 py-2 text-sm font-bold placeholder:text-muted-foreground/40 focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none transition-all disabled:cursor-not-allowed disabled:opacity-50',
                            startIcon && 'pl-10',
                            endIcon && 'pr-10',
                            error && 'ring-2 ring-destructive/20 border-destructive/50',
                            className
                        )}
                        ref={ref}
                        {...props}
                    />
                    {endIcon && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            {endIcon}
                        </div>
                    )}
                </div>
                {error && <p className="text-xs text-destructive" role="alert">{error}</p>}
            </div>
        )
    }
)

Input.displayName = 'Input'
