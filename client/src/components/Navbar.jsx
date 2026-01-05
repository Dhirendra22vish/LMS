import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { BookOpen, LogOut, User, LayoutDashboard, Database, Users } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
        setIsMobileMenuOpen(false);
    };

    return (
        <nav className="bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-indigo-100 shadow-sm">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="flex items-center space-x-2 group">
                        <div className="bg-indigo-600 p-1.5 rounded-lg group-hover:bg-indigo-700 transition-colors">
                            <BookOpen size={24} className="text-white" />
                        </div>
                        <span className="font-bold text-xl bg-gradient-to-r from-indigo-700 to-indigo-500 bg-clip-text text-transparent">
                            LibraryMS
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-2 md:space-x-6">
                        {user ? (
                            <>
                                <div className="flex items-center space-x-1">
                                    <NavLink to="/dashboard" icon={<LayoutDashboard size={18} />} label="Dashboard" />
                                    {(user.role === 'admin' || user.role === 'librarian') && (
                                        <>
                                            <NavLink to="/books" icon={<Database size={18} />} label="Books" />
                                            <NavLink to="/members" icon={<Users size={18} />} label="Members" />
                                            <NavLink to="/issue-return" icon={<BookOpen size={18} />} label="Circulation" />
                                        </>
                                    )}
                                    <NavLink to="/history" icon={<Database size={18} />} label="History" />
                                </div>

                                <div className="flex items-center gap-3 pl-4 md:border-l md:border-indigo-100">
                                    <div className="text-right hidden sm:block">
                                        <p className="text-sm font-semibold text-slate-700">{user.name}</p>
                                        <p className="text-xs text-indigo-600 font-medium capitalize">{user.role}</p>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-all duration-200"
                                        title="Logout"
                                    >
                                        <LogOut size={20} />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <Link
                                to="/login"
                                className="flex items-center space-x-2 px-5 py-2.5 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-200"
                            >
                                <User size={18} />
                                <span>Login</span>
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <div className="md:hidden flex items-center">
                        {user && (
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                {isMobileMenuOpen ? <LogOut size={24} className="rotate-180" /> : <LayoutDashboard size={24} />}
                            </button>
                        )}
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                {isMobileMenuOpen && user && (
                    <div className="md:hidden py-4 border-t border-indigo-50 space-y-2 animate-in slide-in-from-top-2">
                        <MobileNavLink to="/dashboard" label="Dashboard" onClick={() => setIsMobileMenuOpen(false)} />
                        {(user.role === 'admin' || user.role === 'librarian') && (
                            <>
                                <MobileNavLink to="/books" label="Books" onClick={() => setIsMobileMenuOpen(false)} />
                                <MobileNavLink to="/members" label="Members" onClick={() => setIsMobileMenuOpen(false)} />
                                <MobileNavLink to="/issue-return" label="Circulation" onClick={() => setIsMobileMenuOpen(false)} />
                            </>
                        )}
                        <MobileNavLink to="/history" label="History" onClick={() => setIsMobileMenuOpen(false)} />
                        <div className="pt-3 mt-3 border-t border-slate-100 flex justify-between items-center px-4">
                            <div>
                                <p className="text-sm font-medium text-slate-800">{user.name}</p>
                                <p className="text-xs text-slate-500 capitalize">{user.role}</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="text-sm text-red-600 font-medium"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

const MobileNavLink = ({ to, label, onClick }) => (
    <Link
        to={to}
        onClick={onClick}
        className="block px-4 py-2.5 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors font-medium"
    >
        {label}
    </Link>
);

// Helper component for cleaner code
const NavLink = ({ to, icon, label }) => (
    <Link
        to={to}
        className="flex items-center space-x-1.5 px-3 py-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200 font-medium text-sm"
    >
        {icon}
        <span>{label}</span>
    </Link>
);

export default Navbar;
