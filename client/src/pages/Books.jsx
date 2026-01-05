import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2, Search } from 'lucide-react';

const Books = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ title: '', author: '', isbn: '', category: '', quantity: '' });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const res = await axios.get('/api/books');
            setBooks(res.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this book?')) {
            try {
                await axios.delete(`/api/books/${id}`);
                setBooks(books.filter(book => book._id !== id));
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                const res = await axios.put(`/api/books/${editingId}`, formData);
                setBooks(books.map(book => book._id === editingId ? res.data : book));
            } else {
                const res = await axios.post('/api/books', formData);
                setBooks([...books, res.data]);
            }
            setShowModal(false);
            setFormData({ title: '', author: '', isbn: '', category: '', quantity: '' });
            setEditingId(null);
        } catch (error) {
            console.error(error);
        }
    };

    const openEditModal = (book) => {
        setFormData({
            title: book.title,
            author: book.author,
            isbn: book.isbn,
            category: book.category,
            quantity: book.quantity
        });
        setEditingId(book._id);
        setShowModal(true);
    };

    const [selectedCategory, setSelectedCategory] = useState('');

    // Extract unique categories for filter dropdown
    const categories = ['All', ...new Set(books.map(book => book.category))];

    const filteredBooks = books.filter(book => {
        const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory && selectedCategory !== 'All' ? book.category === selectedCategory : true;

        return matchesSearch && matchesCategory;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Books Management</h1>
                    <p className="text-slate-500 mt-1">Manage library collection and inventory</p>
                </div>
                <button
                    onClick={() => { setShowModal(true); setEditingId(null); setFormData({ title: '', author: '', isbn: '', category: '', quantity: '' }) }}
                    className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg flex items-center hover:bg-indigo-700 transition shadow-sm hover:shadow"
                >
                    <Plus size={18} className="mr-2" /> Add Book
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-3 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by title, author, or ISBN..."
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="w-full md:w-48">
                    <select
                        className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat === 'All' ? 'All Categories' : cat}</option>
                        ))}
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-10">Loading books...</div>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Qty</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredBooks.map(book => (
                                    <tr key={book._id}>
                                        <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900">{book.title}</div><div className="text-xs text-gray-500">{book.isbn}</div></td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{book.author}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{book.quantity}</td>
                                        <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">{book.category}</span></td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button onClick={() => openEditModal(book)} className="text-indigo-600 hover:text-indigo-900 mr-4"><Edit size={18} /></button>
                                            <button onClick={() => handleDelete(book._id)} className="text-red-600 hover:text-red-900"><Trash2 size={18} /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
                    <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-4">{editingId ? 'Edit Book' : 'Add New Book'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input type="text" placeholder="Title" required className="w-full p-2 border rounded" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                            <input type="text" placeholder="Author" required className="w-full p-2 border rounded" value={formData.author} onChange={e => setFormData({ ...formData, author: e.target.value })} />
                            <input type="text" placeholder="ISBN" required className="w-full p-2 border rounded" value={formData.isbn} onChange={e => setFormData({ ...formData, isbn: e.target.value })} />
                            <input type="text" placeholder="Category" required className="w-full p-2 border rounded" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} />
                            <input type="number" placeholder="Quantity" required className="w-full p-2 border rounded" value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: e.target.value })} />
                            <div className="flex justify-end space-x-3 mt-6">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">{editingId ? 'Update' : 'Add'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Books;
