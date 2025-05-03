import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { FiList, FiClock, FiSettings, FiLogOut } from 'react-icons/fi';
import { useAdmin } from '../context/AdminContext';

const SidebarLayout = () => {
  const { admin, loading } = useAdmin();

  if (loading || !admin) {
    return <div className="p-6 text-center">Loading admin profile...</div>;
  }

  const profileImage = admin.photo?.startsWith('/uploads/')
    ? `${import.meta.env.VITE_BACKEND_URL}${admin.photo}`
    : admin.photo || '/default-profile.png';

  return (
    <div className="flex min-h-screen font-sans bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-xl p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-10 text-center text-blue-600">Admin Panel</h2>
          <nav className="space-y-6 text-gray-700 text-base font-medium">
            <Link to="/admin-panel/issues" className="flex items-center gap-3 hover:text-blue-500">
              <FiList /> Issues
            </Link>
            <Link to="/admin-panel/history" className="flex items-center gap-3 hover:text-blue-500">
              <FiClock /> History
            </Link>
            <Link to="/admin-panel/settings" className="flex items-center gap-3 hover:text-blue-500">
              <FiSettings /> Settings
            </Link>
          </nav>
        </div>

        <div className="mt-12">
          <Link to="/" className="flex items-center gap-3 text-red-600 hover:text-red-800">
            <FiLogOut /> Logout
          </Link>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-gray-100">
        {/* Fixed Top Navbar */}
        <div className="w-full flex justify-end items-center px-6 py-4 bg-white shadow-md sticky top-0 z-50">
          <div className="flex items-center gap-3">
            <span className="text-base font-medium text-gray-800">{admin.name || "Admin"}</span>
            <img
              src={profileImage}
              alt="Admin Profile"
              className="w-10 h-10 rounded-full object-cover"
            />
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default SidebarLayout;
