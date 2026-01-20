import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Navigation } from './components/layout/Navigation'
import { Footer } from './components/layout/Footer'
import { PaperGrid } from './components/papers/PaperGrid'
import { AddPaperForm } from './components/papers/AddPaperForm'
import { Hero } from './components/hero/Hero'
import { LanguageProvider, useLanguage } from './context/LanguageContext'
import { FilterProvider } from './context/FilterContext'
import { About } from './components/pages/About'
import { AdminDashboard } from './components/pages/AdminDashboard'
import { Contribute } from './components/pages/Contribute'
import { seedData } from './lib/firebase/seed'
import { useEffect } from 'react'

import { isAdminHost } from './lib/utils/hostname'

import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './components/auth/ProtectedRoute'

function AppContent() {
    const { t } = useLanguage()
    const isSpecialAdminPortal = isAdminHost()

    useEffect(() => {
        seedData()
    }, [])

    return (
        <div className="min-h-screen bg-background text-foreground font-sans antialiased selection:bg-primary/10 selection:text-primary">
            <Navigation />
            <main id="main-content" role="main">
                <Routes>
                    {isSpecialAdminPortal ? (
                        /* Admin-Only Domain Routes */
                        <Route path="/" element={<AdminDashboard />} />
                    ) : (
                        /* Public Domain Routes */
                        <>
                            <Route path="/" element={
                                <div className="space-y-0">
                                    <Hero />
                                    <div id="papers-section" className="section-container section-spacing space-y-12">
                                        <div className="space-y-4 text-center md:text-left">
                                            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-secondary">
                                                {t('papers.title')}
                                            </h2>
                                            <div className="h-1.5 w-20 bg-primary/20 rounded-full" />
                                        </div>
                                        <PaperGrid />
                                    </div>
                                </div>
                            } />
                            <Route path="/about" element={<About />} />
                        </>
                    )}

                    {/* Common Routes (accessible from both or for convenience) */}
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/contribute" element={<Contribute />} />
                    <Route path="/add-paper" element={
                        <ProtectedRoute>
                            <div className="section-container page-header-padding pb-20">
                                <AddPaperForm />
                            </div>
                        </ProtectedRoute>
                    } />
                </Routes>
            </main>
            <Footer />
        </div>
    )
}

function App() {
    return (
        <AuthProvider>
            <LanguageProvider>
                <FilterProvider>
                    <BrowserRouter>
                        <AppContent />
                    </BrowserRouter>
                </FilterProvider>
            </LanguageProvider>
        </AuthProvider>
    )
}

export default App
