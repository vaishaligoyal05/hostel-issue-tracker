import React, { useState, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import axios from '../api/axios';

const Settings = () => {
  const { admin, updateAdmin } = useAdmin();
  const [name, setName] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [mobile, setMobile] = useState('');
  const [preview, setPreview] = useState('');

  // Load admin profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('/admin/me');
        updateAdmin({
          name: res.data.name || '',
          mobile: res.data.phone || '',
          photo: res.data.profileImage || '',
        });
      } catch (err) {
        console.error('Failed to load admin profile:', err);
      }
    };

    fetchProfile();
  }, [updateAdmin]);

  // Update local state when admin context changes
  useEffect(() => {
    setName(admin.name || '');
    setMobile(admin.mobile || '');
    setPreview(admin.photo || '');
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (!name.trim() || !mobile.trim()) {
      alert('Name and mobile number are required!');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('mobile', mobile);
      if (photoFile) {
        formData.append('photo', photoFile);
      }

      const res = await axios.put('/admin/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Sync context and localStorage
      updateAdmin({
        name: res.data.admin.name,
        mobile: res.data.admin.mobile,
        photo: res.data.admin.photo,
      });

      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Admin Profile Settings</h2>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Profile Picture</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="w-24 h-24 mt-4 rounded-full object-cover"
          />
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium">Name</label>
        <input
          type="text"
          className="mt-1 w-full p-2 border rounded-md"
          placeholder="Enter admin name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium">Mobile Number</label>
        <input
          type="text"
          className="mt-1 w-full p-2 border rounded-md"
          placeholder="Enter mobile number"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
        />
      </div>

      <button
        onClick={handleSave}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      >
        Save Changes
      </button>
    </div>
  );
};

export default Settings;
