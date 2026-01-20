import { TrendingUp, Award } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { usersApi } from '../../lib/firebase/users'

export function ContributorStats() {
    const { user } = useAuth()
    const [uploadCount, setUploadCount] = useState(0)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async () => {
            if (user?.uid) {
                try {
                    const profile = await usersApi.getAllUsers()
                    const currentUser = profile.find(u => u.uid === user.uid)
                    setUploadCount(currentUser?.papersUploaded || 0)
                } catch (error) {
                    console.error('Failed to fetch contributor stats:', error)
                } finally {
                    setLoading(false)
                }
            }
        }
        fetchStats()
    }, [user])

    if (loading) {
        return (
            <div className="bg-gradient-to-br from-primary to-primary/90 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-primary/20 animate-pulse">
                <div className="h-20 bg-white/10 rounded-xl" />
            </div>
        )
    }

    const getMessage = () => {
        if (uploadCount === 0) return "Start your journey! Upload your first paper."
        if (uploadCount < 5) return "Great start! Keep contributing."
        if (uploadCount < 10) return "Amazing work! You're making a difference."
        if (uploadCount < 25) return "Incredible! You're a top contributor."
        return "Legend! Thank you for your dedication."
    }

    return (
        <div className="h-full bg-gradient-to-br from-primary to-primary/90 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-primary/20 relative overflow-hidden group flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-white/10 transition-colors duration-700 pointer-events-none" />

            <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md">
                        <Award className="text-white w-6 h-6" />
                    </div>
                    <h2 className="text-xl font-bold tracking-tight">Your Contribution</h2>
                </div>

                <div>
                    <div className="flex items-baseline gap-2">
                        <p className="text-5xl font-black">{uploadCount}</p>
                        <TrendingUp className="w-6 h-6 text-white/80" />
                    </div>
                    <p className="text-sm font-bold uppercase tracking-widest text-white/80">
                        {uploadCount === 1 ? 'Paper Uploaded' : 'Papers Uploaded'}
                    </p>
                </div>

                <p className="text-sm font-medium text-white/90 pt-2">
                    {getMessage()}
                </p>
            </div>
        </div>
    )
}
