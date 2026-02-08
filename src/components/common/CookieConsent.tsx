import { useState, useEffect } from 'react';
import { Cookie, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { statsApi } from '../../lib/firebase/stats';

export function CookieConsent() {
    const { user, profile, updateConsent } = useAuth();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Show banner if consent choice hasn't been made yet (stored in Firestore)
        if (profile && profile.hasConsented === undefined) {
            const timer = setTimeout(() => setIsVisible(true), 1000);
            return () => clearTimeout(timer);
        } else {
            setIsVisible(false);
        }
    }, [profile, isVisible]);

    const handleAccept = async () => {
        if (!user) return;
        await updateConsent(true);
        statsApi.trackVisitor(user.uid);
        setIsVisible(false);
    };

    const handleDecline = async () => {
        if (!user) return;
        await updateConsent(false);
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div
            className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-slide-up"
            style={{
                animation: 'slideUp 0.3s ease-out'
            }}
        >
            <div className="max-w-4xl mx-auto bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                        <Cookie className="h-6 w-6 text-primary" />
                    </div>

                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            Cookie Notice
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                            We use cookies to track site visits and downloads for analytics purposes.
                            No personal data is collected—only anonymous visit counts and download statistics.
                            You can decline if you prefer not to be tracked.
                        </p>

                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={handleAccept}
                                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm"
                            >
                                Accept
                            </button>
                            <button
                                onClick={handleDecline}
                                className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium text-sm"
                            >
                                Decline
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={handleDecline}
                        className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                        aria-label="Close"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes slideUp {
                    from {
                        transform: translateY(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
            `}</style>
        </div>
    );
}
