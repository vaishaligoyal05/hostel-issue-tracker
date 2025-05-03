import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { UserContext } from '../context/UserContext';

const IssueDetail = () => {
  const { id: issueId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [issue, setIssue] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedText, setEditedText] = useState(''); // ✅ Added missing state

  useEffect(() => {
    if (!issueId) {
      console.error("No issue ID found in URL.");
      navigate('/');
      return;
    }

    const fetchIssue = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`/issues/${issueId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setIssue(res.data.issue);
        setComments(res.data.comments || []);
      } catch (error) {
        console.error('Failed to fetch issue details:', error);
      }
    };

    fetchIssue();
  }, [issueId, navigate]);

  const isOwner = issue?.username === user?.username;
  const isAdmin = user?.role === 'Admin';

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `/issues/comment/${issueId}`,
        { text: newComment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setComments(prev => [...prev, res.data.comment]);
      setNewComment('');
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const handleSaveEditedComment = async (index) => {
    const comment = comments[index];
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `/comments/${comment._id}`,
        { text: editedText },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const updated = [...comments];
      updated[index].text = editedText;
      setComments(updated);
      setEditingIndex(null);
    } catch (error) {
      console.error('Failed to update comment:', error);
    }
  };

  const handleDeleteComment = async (index) => {
    const comment = comments[index];
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/comments/${comment._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setComments(comments.filter((_, i) => i !== index));
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  const handleChangeStatus = async (newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `/issues/status/${issue._id}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIssue(prev => ({ ...prev, status: newStatus }));
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Issue Detail</h2>

      {issue ? (
        <div className="space-y-4">
          <p><strong>Reported by:</strong> {issue.username}</p>
          <p><strong>Floor:</strong> {issue.floor}</p>
          <p><strong>Type:</strong> {issue.issueType}</p>
          <p><strong>Status:</strong> {issue.status}</p>
          <p><strong>Reported on:</strong> {new Date(issue.createdAt).toLocaleString()}</p>
          <p className="text-gray-700">{issue.description}</p>

          {issue.image && (
            <img
              src={issue.image}
              alt="Issue"
              className="w-full rounded-lg mt-4"
            />
          )}

          {isAdmin && (
            <div className="mt-4">
              <p><strong>Update Status:</strong></p>
              <div className="flex gap-4 mt-2">
                <button onClick={() => handleChangeStatus('Resolved')} className="bg-green-500 text-white px-4 py-2 rounded">Resolve</button>
                <button onClick={() => handleChangeStatus('In Progress')} className="bg-yellow-500 text-white px-4 py-2 rounded">In Progress</button>
                <button onClick={() => handleChangeStatus('Pending')} className="bg-blue-500 text-white px-4 py-2 rounded">Pending</button>
              </div>
            </div>
          )}

          {/* Comments Section */}
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">Comments</h3>
            <div className="space-y-2">
              {comments.map((c, index) => (
                <div key={c._id || index} className="bg-gray-100 p-2 rounded flex justify-between items-center">
                  {editingIndex === index ? (
                    <>
                      <input
                        type="text"
                        className="border p-1 rounded w-full mr-2"
                        value={editedText}
                        onChange={(e) => setEditedText(e.target.value)}
                      />
                      <button
                        className="text-xs bg-green-500 text-white px-2 py-1 rounded mr-1"
                        onClick={() => handleSaveEditedComment(index)}
                      >
                        Save
                      </button>
                      <button
                        className="text-xs bg-gray-400 text-white px-2 py-1 rounded"
                        onClick={() => setEditingIndex(null)}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <p className="text-sm text-gray-800 flex-1">
                        <strong>{c.username}:</strong> {c.text}
                      </p>
                      {c.username === user?.username && (
                        <div className="flex gap-1">
                          <button
                            onClick={() => {
                              setEditingIndex(index);
                              setEditedText(c.text);
                            }}
                            className="text-xs bg-yellow-500 text-white px-2 py-1 rounded"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteComment(index)}
                            className="text-xs bg-red-500 text-white px-2 py-1 rounded"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center gap-2">
              <input
                type="text"
                placeholder="Add a comment"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1 border px-3 py-2 rounded"
              />
              <button
                onClick={handleAddComment}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                Comment
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p>Loading issue details...</p>
      )}
    </div>
  );
};

export default IssueDetail;
