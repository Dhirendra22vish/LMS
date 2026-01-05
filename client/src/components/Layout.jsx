import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8">
                <Outlet />
            </main>
            <footer className="bg-white/80 backdrop-blur-sm border-t border-slate-200 py-6 text-center text-slate-500 text-sm">
                <p>© {new Date().getFullYear()} Library Management System. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Layout;
