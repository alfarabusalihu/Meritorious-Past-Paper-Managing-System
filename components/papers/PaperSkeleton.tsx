export default function PaperSkeleton() {
    return (
        <div className="bg-card border rounded-2xl p-5 shadow-sm space-y-4 animate-pulse">
            <div className="flex justify-between">
                <div className="h-10 w-10 bg-muted rounded-xl" />
                <div className="h-5 w-16 bg-muted rounded-full" />
            </div>

            <div className="space-y-2">
                <div className="h-5 w-3/4 bg-muted rounded" />
                <div className="h-4 w-1/2 bg-muted rounded" />
            </div>

            <div className="pt-4 border-t flex justify-between">
                <div className="h-4 w-12 bg-muted rounded" />
                <div className="h-4 w-20 bg-muted rounded" />
            </div>
        </div>
    );
}
