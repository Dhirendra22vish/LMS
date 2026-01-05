import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { CheckCircle, AlertCircle } from 'lucide-react';

const History = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        fetchHistory();
        // eslint-disable-next-line
    }, []);

    const fetchHistory = async () => {
        try {
            const endpoint = user.role === 'admin' || user.role === 'librarian'
                ? '/api/transactions'
                : '/api/transactions/my-history';

            const res = await axios.get(endpoint);
            setTransactions(res.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const handleReturn = async (id) => {
        if (window.confirm('Mark this book as returned?')) {
            try {
                await axios.put(`/api/transactions/return/${id}`);
                // Refresh list
                const res = await axios.get('/api/transactions');
                setTransactions(res.data);
            } catch (error) {
                console.error(error);
                alert('Error returning book');
            }
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">{user.role === 'student' ? 'My History' : 'Transaction History'}</h1>

            {loading ? (
                <div className="text-center py-10">Loading history...</div>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book</th>
                                    {(user.role === 'admin' || user.role === 'librarian') && (
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
                                    )}
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    {(user.role === 'admin' || user.role === 'librarian') && (
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {transactions.map(t => (
                                    <tr key={t._id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{t.book?.title}</td>
                                        {(user.role === 'admin' || user.role === 'librarian') && (
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{t.member?.name} ({t.member?.email})</td>
                                        )}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(t.issueDate).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(t.dueDate).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {t.status === 'returned' ? (
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 items-center">
                                                    <CheckCircle size={14} className="mr-1" /> Returned
                                                </span>
                                            ) : (
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 items-center">
                                                    <AlertCircle size={14} className="mr-1" /> Issued
                                                </span>
                                            )}
                                        </td>
                                        {(user.role === 'admin' || user.role === 'librarian') && (
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                {t.status === 'issued' && (
                                                    <button onClick={() => handleReturn(t._id)} className="text-indigo-600 hover:text-indigo-900">Return</button>
                                                )}
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default History;
