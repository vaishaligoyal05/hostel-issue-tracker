import React, { useState } from "react";
import { updateprofile } from "../api/updateprofile"; // small p in import

export default function ProfileUpdateForm() {
  const [name, setName] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [course, setCourse] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !roomNumber.trim() || !course.trim()) {
      alert("All fields are required.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("roomNumber", roomNumber);
    formData.append("course", course);
    if (profilePic) {
      formData.append("profilePic", profilePic);
    }

    try {
      setLoading(true);
      const response = await updateprofile(formData);
      console.log("Profile updated successfully:", response);
      alert("Profile updated successfully!");
      setName("");
      setRoomNumber("");
      setCourse("");
      setProfilePic(null);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Update Profile</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: "400px" }}>
        <div style={{ marginBottom: "10px" }}>
          <label>Name:</label><br />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Room Number:</label><br />
          <input
            type="text"
            value={roomNumber}
            onChange={(e) => setRoomNumber(e.target.value)}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Course:</label><br />
          <input
            type="text"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Profile Picture (optional):</label><br />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setProfilePic(e.target.files[0])}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <button type="submit" style={{ padding: "10px 20px" }} disabled={loading}>
          {loading ? "Updating..." : "Update"}
        </button>
      </form>
    </div>
  );
}
