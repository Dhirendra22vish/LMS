import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Books from './pages/Books';
import Members from './pages/Members';
import IssueReturn from './pages/IssueReturn';
import History from './pages/History';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/" element={<Layout />}>
        {/* Redirect root to dashboard if logged in, handled by ProtectedRoute/Layout logic or just redirect */}
        <Route index element={<Navigate to="/dashboard" replace />} />

        <Route path="dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />

        <Route path="books" element={
          <ProtectedRoute roles={['admin', 'librarian']}>
            <Books />
          </ProtectedRoute>
        } />
        <Route path="members" element={
          <ProtectedRoute roles={['admin', 'librarian']}>
            <Members />
          </ProtectedRoute>
        } />
        <Route path="issue-return" element={
          <ProtectedRoute roles={['admin', 'librarian']}>
            <IssueReturn />
          </ProtectedRoute>
        } />
        <Route path="history" element={
          <ProtectedRoute>
            <History />
          </ProtectedRoute>
        } />
      </Route>
    </Routes>
  );
}

export default App;
