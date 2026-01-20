import React from 'react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
    return (
        <div className={cn('rounded-3xl border border-muted bg-card text-foreground shadow-xl shadow-black/5', className)}>
            {children}
        </div>
    )
}

export function CardHeader({ className, children }: { className?: string; children: React.ReactNode }) {
    return <div className={cn('flex flex-col space-y-1.5 p-8', className)}>{children}</div>
}

export function CardTitle({ className, children }: { className?: string; children: React.ReactNode }) {
    return <h3 className={cn('text-2xl font-bold leading-none tracking-tight', className)}>{children}</h3>
}

export function CardContent({ className, children }: { className?: string; children: React.ReactNode }) {
    return <div className={cn('p-8 pt-0', className)}>{children}</div>
}

export function CardFooter({ className, children }: { className?: string; children: React.ReactNode }) {
    return <div className={cn('flex items-center p-8 pt-0', className)}>{children}</div>
}
