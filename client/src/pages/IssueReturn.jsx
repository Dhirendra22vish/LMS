import { useState, useEffect } from 'react';
import axios from 'axios';

const IssueReturn = () => {
    const [books, setBooks] = useState([]);
    const [members, setMembers] = useState([]);
    const [formData, setFormData] = useState({ bookId: '', memberId: '', dueDate: '' });
    const [message, setMessage] = useState('');
    const [activeTab, setActiveTab] = useState('issue'); // issue or return

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line
    }, []);

    const fetchData = async () => {
        try {
            const bRes = await axios.get('/api/books');
            const mRes = await axios.get('/api/users');
            setBooks(bRes.data);
            setMembers(mRes.data.filter(u => u.role !== 'admin'));
        } catch (error) {
            console.error(error);
        }
    };

    const handleIssue = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/transactions/issue', formData);
            setMessage('Book issued successfully!');
            setFormData({ bookId: '', memberId: '', dueDate: '' });
            fetchData(); // Refresh quantities
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error issuing book');
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Circulation Desk</h1>

            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex border-b mb-6">
                    <button
                        className={`px-6 py-2 pb-3 font-medium ${activeTab === 'issue' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setActiveTab('issue')}
                    >
                        Issue Book
                    </button>
                    {/* Return can be handled via history or a separate ID input. Let's redirect to History for returns for simplicity or implement ID lookup here. */}
                    {/* For this MVP, let's guide users to History for returns */}
                </div>

                {message && <div className={`p-4 mb-4 rounded ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{message}</div>}

                {activeTab === 'issue' && (
                    <form onSubmit={handleIssue} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-gray-700 mb-2">Select Member</label>
                                <select
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500"
                                    value={formData.memberId}
                                    onChange={(e) => setFormData({ ...formData, memberId: e.target.value })}
                                    required
                                >
                                    <option value="">-- Select Member --</option>
                                    {members.map(m => (
                                        <option key={m._id} value={m._id}>{m.name} ({m.email})</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-2">Select Book</label>
                                <select
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500"
                                    value={formData.bookId}
                                    onChange={(e) => setFormData({ ...formData, bookId: e.target.value })}
                                    required
                                >
                                    <option value="">-- Select Book --</option>
                                    {books.map(b => (
                                        <option key={b._id} value={b._id} disabled={b.quantity <= 0}>
                                            {b.title} {b.quantity <= 0 ? '(Out of Stock)' : ''}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-2">Due Date</label>
                                <input
                                    type="date"
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500"
                                    value={formData.dueDate}
                                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition">
                            Issue Book
                        </button>
                    </form>
                )}
            </div>

            <div className="mt-8 bg-blue-50 p-4 rounded border border-blue-200">
                <h3 className="text-blue-800 font-semibold">Note:</h3>
                <p className="text-blue-700 text-sm mt-1">
                    To return a book, please navigate to the <b>History</b> page, find the transaction, and click "Return".
                </p>
            </div>
        </div>
    );
};

export default IssueReturn;
