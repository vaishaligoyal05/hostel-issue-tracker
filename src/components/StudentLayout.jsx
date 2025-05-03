import React, { useState, useContext, useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import StudentProfileModal from './StudentProfileModal';
import { UserContext } from '../context/UserContext';

const StudentLayout = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { user, fetchUserProfile } = useContext(UserContext);

  const [profile, setProfile] = useState({
    name: 'Student',
    phone: '',
    class: '',
    room: '',
    photo: '/default-profile.png',
  });

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || 'Student',
        phone: user.phone || '',
        class: user.className || '',
        room: user.room || '',
        photo: user.profileImage
          ? `http://localhost:5000${user.profileImage}`
          : '/default-profile.png',
      });
    }
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 py-4 shadow">
        <div className="flex items-center gap-2 font-semibold text-lg">
          <span className="text-xl">🏠</span> Mai Bhago Hostel
        </div>
        <ul className="flex items-center gap-6 text-sm font-medium">
          <li>
            <Link to="/student/dashboard" className="hover:underline">
              Home
            </Link>
          </li>
          <li>
            <Link to="/student/explore" className="hover:underline">
              Explore
            </Link>
          </li>
          <li>
            <Link to="/student/help" className="hover:underline">
              Help
            </Link>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </li>
          <li>
            <img
              src={profile.photo}
              alt="Profile"
              className="w-8 h-8 rounded-full cursor-pointer object-cover"
              onClick={() => setIsModalOpen(true)}
            />
          </li>
        </ul>
      </nav>

      {/* Modal */}
      {isModalOpen && (
        <StudentProfileModal
          onClose={() => setIsModalOpen(false)}
          setProfile={setProfile} // ✅ so modal can update image in navbar
        />
      )}

      {/* Main content */}
      <div className="p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default StudentLayout;
  