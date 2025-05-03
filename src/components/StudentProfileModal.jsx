import { useContext, useEffect, useState } from 'react';
import { updateprofile } from '../api/updateprofile';
import { UserContext } from '../context/UserContext';

const StudentProfileModal = ({ onClose, setProfile }) => {
  const { user, fetchUserProfile } = useContext(UserContext);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    className: '',
    room: '',
    profilePic: null,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        className: user.className || '',
        room: user.room || '',
        profilePic: null,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      profilePic: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('phone', formData.phone);
    data.append('className', formData.className);
    data.append('roomNumber', formData.room);
    if (formData.profilePic) {
      data.append('profilePic', formData.profilePic);
    }

    try {
      const res = await updateprofile(data);
      fetchUserProfile(); // ✅ updates context
      if (res?.profileImage) {
        setProfile((prev) => ({
          ...prev,
          name: res.name,
          phone: res.phone,
          class: res.className,
          room: res.roomNumber,
          photo: `http://localhost:5000${res.profileImage}`,
        }));
      }
      onClose();
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile.');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-[400px]">
        <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="className"
            placeholder="Class"
            value={formData.className}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="room"
            placeholder="Room No"
            value={formData.room}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            type="file"
            name="profilePic"
            onChange={handleFileChange}
            className="border p-2 rounded"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={onClose}
            className="text-red-600 mt-2"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentProfileModal;
