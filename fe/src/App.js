import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { ConfigProvider, App as AntdApp } from 'antd';
import { jwtDecode } from 'jwt-decode';
import AdminLayout from './pages/admin/AdminLayout';
import UserLayout from './pages/user/UserLayout';
import Dashboard from './pages/admin/Dashboard';
import PendingDeposits from './pages/admin/PendingDeposits'; // Thêm import
import Home from './pages/user/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import { showSuccessNotification, showInfoNotification } from './components/notifications';
import Profile from './pages/user/Profile';
import ProductDetail from './pages/user/ProductDetail';
import AboutUs from './pages/user/AboutUs';
import Contact from './components/Contact';
import AllProductsPage from './pages/user/AllProductsPage';
import BlogList from './pages/admin/BlogsList';
import FieldList from './pages/admin/FieldList';
import OrderList from './pages/admin/OrderList';
import AdminUserList from './pages/admin/AdminUserList';
import BlogDetail from './pages/user/BlogDetail';
import ContactList from './pages/admin/ContactList';

const ProtectedRoute = ({ children, isAdmin }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [hasCorrectRole, setHasCorrectRole] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    
    if (!token) {
      setIsAuthenticated(false);
      navigate('/login');
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      if (!decodedToken.role) {
        throw new Error('No role in token');
      }

      const userRole = decodedToken.role;
      const requiredRole = isAdmin ? 'admin' : 'user';
      const isRoleValid = userRole === requiredRole;

      setIsAuthenticated(true);
      setHasCorrectRole(isRoleValid);

      if (!isRoleValid) {
        navigate(userRole === 'admin' ? '/admin' : '/user');
      }
    } catch (error) {
      setIsAuthenticated(false);
      localStorage.removeItem('token');
      navigate('/login');
    }
  }, [navigate, isAdmin]);

  if (isAuthenticated === null || hasCorrectRole === null) return null;
  if (!isAuthenticated || !hasCorrectRole) return null;

  return isAdmin ? <AdminLayout>{children}</AdminLayout> : <UserLayout>{children}</UserLayout>;
};

const PaymentCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const notificationShown = sessionStorage.getItem('payment_notification_shown');
    
    if (!notificationShown) {
      const isSuccess = location.pathname.includes('/payos/success');
      const isCancel = location.pathname.includes('/payos/cancel');

      if (isSuccess) {
        showSuccessNotification(
          'Payment Successful',
          'Your deposit has been completed successfully'
        );
        sessionStorage.setItem('payment_notification_shown', 'true');
      } else if (isCancel) {
        showInfoNotification(
          'Payment Cancelled',
          'You have cancelled the payment process'
        );
        sessionStorage.setItem('payment_notification_shown', 'true');
      }
    }

    setTimeout(() => {
      navigate('/user/profile');
      setTimeout(() => {
        sessionStorage.removeItem('payment_notification_shown');
      }, 2000);
    }, 100);
  }, [navigate, location]);

  return null;
};

function App() {
  return (
    <ConfigProvider>
      <AntdApp>
        <Router>
          <Routes>
            <Route path="/login" element={<Login onSuccess={() => window.location.href = '/user'} />} />
            <Route path="/register" element={<Register onSuccess={() => window.location.href = '/verify'} />} />
            <Route path="/admin" element={<ProtectedRoute isAdmin><Dashboard /></ProtectedRoute>} />
            <Route path="/admin/pending-deposits" element={<ProtectedRoute isAdmin><PendingDeposits /></ProtectedRoute>} />
            <Route path="/admin/blog" element={<ProtectedRoute isAdmin><BlogList /></ProtectedRoute>} />
            <Route path="/admin/fleld" element={<ProtectedRoute isAdmin><FieldList /></ProtectedRoute>} /> {/* Thêm route mới */}
            <Route path="/admin/oder" element={<ProtectedRoute isAdmin><OrderList /></ProtectedRoute>} /> {/* Thêm route mới */}
            <Route path="/admin/users" element={<ProtectedRoute isAdmin><AdminUserList /></ProtectedRoute>} /> {/* Thêm route mới */}
            <Route path="/admin/contact" element={<ProtectedRoute isAdmin><ContactList /></ProtectedRoute>} /> {/* Thêm route mới */}
             
             
             {/* Thêm route mới */}
            <Route path="/user" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/user/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/payos/success" element={<PaymentCallback />} />
            <Route path="/payos/cancel" element={<PaymentCallback />} />
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/product-detail/:id" element={<ProtectedRoute><ProductDetail /></ProtectedRoute>} />
            <Route path="/blogs/:id" element={<ProtectedRoute ><BlogDetail /></ProtectedRoute>} /> {/* Thêm route mới */}

            <Route path="/about" element={<ProtectedRoute><AboutUs /></ProtectedRoute>} />
            <Route path="/contact" element={<ProtectedRoute><Contact /></ProtectedRoute>} />
            <Route path="/product" element={<ProtectedRoute><AllProductsPage /></ProtectedRoute>} />


          </Routes>
        </Router>
      </AntdApp>
    </ConfigProvider>
  );
}

export default App;