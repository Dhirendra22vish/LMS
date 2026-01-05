import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

import { BookOpen, Users, ArrowUpRight, BookMarked } from 'lucide-react';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState({ totalBooks: 0, totalMembers: 0, issuedBooks: 0 });

    useEffect(() => {
        if (user && (user.role === 'admin' || user.role === 'librarian')) {
            axios.get('/api/dashboard/stats')
                .then(res => setStats(res.data))
                .catch(err => console.error(err));
        }
    }, [user]);

    return (
        <div className="space-y-8">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
                    <p className="text-slate-500 mt-2">Overview of library performance and activities</p>
                </div>
            </header>

            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
                <div className="relative z-10">
                    <h2 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h2>
                    <p className="text-indigo-100 max-w-xl text-lg">
                        You are logged in as <span className="font-semibold uppercase bg-white/20 px-2 py-0.5 rounded text-sm tracking-wider">{user?.role}</span>
                    </p>
                    <p className="mt-6 text-indigo-50">
                        {user?.role === 'admin'
                            ? 'Manage your library efficiently. Access detailed reports and management tools from the navigation bar.'
                            : 'Explore our collection, view your reading history, and manage your account settings.'}
                    </p>
                </div>
                {/* Decorative Pattern */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-black/10 rounded-full blur-2xl"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    label="Total Books"
                    value={stats.totalBooks}
                    icon={<BookOpen className="text-blue-600" size={24} />}
                    color="bg-blue-50"
                    trend="+12% from last month"
                />
                <StatCard
                    label="Active Members"
                    value={stats.totalMembers}
                    icon={<Users className="text-emerald-600" size={24} />}
                    color="bg-emerald-50"
                    trend="+5 new this week"
                />
                <StatCard
                    label="Issued Books"
                    value={stats.issuedBooks}
                    icon={<BookMarked className="text-amber-600" size={24} />}
                    color="bg-amber-50"
                    trend="active loans"
                />
            </div>

            <RecentActivity />
        </div>
    );
};

const RecentActivity = () => {
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        axios.get('/api/transactions')
            .then(res => setActivities(res.data.slice(0, 5)))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Activity</h3>
            <div className="space-y-4">
                {activities.length === 0 ? (
                    <p className="text-slate-500 text-sm">No recent activity.</p>
                ) : (
                    activities.map((activity) => (
                        <div key={activity._id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                                <div className={`p-2 rounded-full ${activity.status === 'returned' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                                    {activity.status === 'returned' ? <BookOpen size={16} /> : <BookMarked size={16} />}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-800">
                                        <span className="font-bold">{activity.book?.title}</span> was {activity.status}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        by {activity.member?.name}
                                    </p>
                                </div>
                            </div>
                            <span className="text-xs text-slate-400">
                                {new Date(activity.issueDate).toLocaleDateString()}
                            </span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

const StatCard = ({ label, value, icon, color, trend }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300">
        <div className="flex justify-between items-start">
            <div className={`p-3 rounded-lg ${color}`}>
                {icon}
            </div>
            {trend && (
                <span className="flex items-center text-xs font-medium text-slate-500 bg-slate-50 px-2 py-1 rounded-full">
                    {trend}
                    <ArrowUpRight size={12} className="ml-1" />
                </span>
            )}
        </div>
        <div className="mt-4">
            <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wider">{label}</h3>
            <p className="text-3xl font-bold text-slate-800 mt-1">{value}</p>
        </div>
    </div>
);

export default Dashboard;
