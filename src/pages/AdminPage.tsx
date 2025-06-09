
import { useEffect } from 'react';
import { AdminRoute } from '@/components/admin/AdminRoute';

const AdminPage = () => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return <AdminRoute />;
};

export default AdminPage;
