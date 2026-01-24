export const isAdminHost = () => {
    // 1. Check if we are on a known admin subdomain (e.g., admin.merit-series.com)
    const hostname = window.location.hostname;
    const isAdminDomain = hostname.startsWith('admin.') || hostname.includes('admin-merit-series');

    // 2. Fallback to an environment variable set in Vercel
    const isAdminBuild = import.meta.env.VITE_APP_TYPE === 'ADMIN';

    return isAdminDomain || isAdminBuild;
};
