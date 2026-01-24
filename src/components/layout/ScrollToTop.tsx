import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function ScrollToTop() {
    const { pathname, hash } = useLocation();

    useEffect(() => {
        if (!hash) {
            window.scrollTo(0, 0);
        } else {
            // Small timeout to allow lazy loaded components to mount
            const timeoutId = setTimeout(() => {
                const id = hash.replace('#', '');
                const element = document.getElementById(id);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }, 500); // 500ms delay to catch lazy loaded content

            return () => clearTimeout(timeoutId);
        }
    }, [pathname, hash]);

    return null;
}
