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

function AppContent() {
    const { t } = useLanguage()

    useEffect(() => {
        seedData()
    }, [])

    return (
        <div className="min-h-screen bg-background text-foreground font-sans antialiased selection:bg-primary/10 selection:text-primary">
            <Navigation />
            <main id="main-content" role="main">
                <Routes>
                    <Route path="/" element={
                        <div className="space-y-0">
                            <Hero />

                            <div id="papers-section" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 space-y-12">
                                <div className="space-y-4 text-center md:text-left">
                                    <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-secondary">
                                        {t('papers.title')}
                                    </h2>
                                    <div className="h-1.5 w-20 bg-primary/20 rounded-full" />
                                </div>

                                <PaperGrid />
                            </div>
                        </div>
                    } />
                    <Route path="/about" element={<About />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/contribute" element={<Contribute />} />
                    <Route path="/add-paper" element={
                        <div className="py-20 mx-auto max-w-7xl px-4">
                            <AddPaperForm />
                        </div>
                    } />
                </Routes>
            </main>
            <Footer />
        </div>
    )
}

function App() {
    return (
        <LanguageProvider>
            <FilterProvider>
                <BrowserRouter>
                    <AppContent />
                </BrowserRouter>
            </FilterProvider>
        </LanguageProvider>
    )
}

export default App
