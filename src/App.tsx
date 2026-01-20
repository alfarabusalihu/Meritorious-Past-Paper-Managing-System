import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Navigation } from './components/layout/Navigation'
import { Footer } from './components/layout/Footer'
import { LanguageProvider, useLanguage } from './context/LanguageContext'
import { FilterProvider } from './context/FilterContext'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { LoadingPage } from './components/ui/LoadingPage'
import { ErrorPage } from './components/ui/ErrorPage'
import { ErrorBoundary } from 'react-error-boundary'
import { seedData } from './lib/firebase/seed'
import { useEffect, lazy, Suspense } from 'react'
import { isAdminHost } from './lib/utils/hostname'

// Lazy Load Components for Performance
const PaperGrid = lazy(() => import('./components/papers/PaperGrid').then(m => ({ default: m.PaperGrid })))
const AddPaperForm = lazy(() => import('./components/papers/AddPaperForm').then(m => ({ default: m.AddPaperForm })))
const Hero = lazy(() => import('./components/hero/Hero').then(m => ({ default: m.Hero })))
const About = lazy(() => import('./components/pages/About').then(m => ({ default: m.About })))
const AdminDashboard = lazy(() => import('./components/pages/AdminDashboard').then(m => ({ default: m.AdminDashboard })))
const Contribute = lazy(() => import('./components/pages/Contribute').then(m => ({ default: m.Contribute })))
const RecycleBin = lazy(() => import('./components/admin/RecycleBin').then(m => ({ default: m.RecycleBin })))

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
                <ErrorBoundary FallbackComponent={ErrorPage}>
                    <Suspense fallback={<LoadingPage />}>
                        <Routes>
                            {isSpecialAdminPortal ? (
                                <Route path="/" element={<AdminDashboard />} />
                            ) : (
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

                            <Route path="/admin" element={<AdminDashboard />} />
                            <Route path="/admin/trash" element={
                                <ProtectedRoute requireSuperAdmin={true}>
                                    <RecycleBin />
                                </ProtectedRoute>
                            } />
                            <Route path="/contribute" element={<Contribute />} />
                            <Route path="/add-paper" element={
                                <ProtectedRoute>
                                    <div className="section-container page-header-padding pb-20">
                                        <AddPaperForm />
                                    </div>
                                </ProtectedRoute>
                            } />
                        </Routes>
                    </Suspense>
                </ErrorBoundary>
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
