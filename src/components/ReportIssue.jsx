import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

export default function ReportIssue() {
  const navigate = useNavigate();

  const [issueType, setIssueType] = useState("");
  const [floor, setFloor] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to report an issue.");
      return;
    }

    const formData = new FormData();
    formData.append("issueType", issueType);
    formData.append("floor", floor);
    formData.append("description", description);
    if (image) {
      formData.append("image", image);
    }

    try {
      const res = await axios.post("/issues/report", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("✅ Issue reported:", res.data);
      navigate("/student/dashboard");
    } catch (err) {
      console.error("❌ Error reporting issue:", err);
      setError(err.response?.data?.message || "Error reporting issue. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center font-[Segoe UI]">
      <div className="bg-white w-[90vw] max-w-2xl rounded-xl shadow-2xl p-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Report an Issue</h2>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
          <div>
            <label className="block text-gray-700 text-lg font-semibold mb-2">Issue Type</label>
            <input
              type="text"
              value={issueType}
              onChange={(e) => setIssueType(e.target.value)}
              placeholder="Enter issue type"
              className="w-full bg-gray-100 rounded-xl py-2 px-4 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-lg font-semibold mb-2">Floor</label>
            <input
              type="text"
              value={floor}
              onChange={(e) => setFloor(e.target.value)}
              placeholder="Enter floor"
              className="w-full bg-gray-100 rounded-xl py-2 px-4 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-lg font-semibold mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue"
              rows="4"
              className="w-full bg-gray-100 rounded-xl py-2 px-4 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-lg font-semibold mb-2">Upload Image (optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full"
            />
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-full text-lg"
          >
            Submit Issue
          </button>
        </form>
      </div>
    </div>
  );
}
