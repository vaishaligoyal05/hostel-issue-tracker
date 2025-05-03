import axios from '../api/axios';
import { useEffect, useState } from 'react';

const Issues = () => {
  const [issues, setIssues] = useState([]);
  const [resolvedIssues, setResolvedIssues] = useState([]);
  const [token] = useState(localStorage.getItem('token'));
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('All');

  const fetchIssues = async () => {
    try {
      const response = await axios.get('/issues/all', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIssues(response.data.issues || []);
    } catch (error) {
      console.error('Error fetching issues', error);
    }
  };

  const fetchResolvedIssues = async () => {
    try {
      const response = await axios.get('/issues/history', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResolvedIssues(response.data.issues || []);
    } catch (error) {
      console.error('Error fetching resolved issues', error);
    }
  };

  const updateStatus = async (issueId, newStatus) => {
    try {
      const statusUpdate = {
        status: newStatus,
        resolvedAt: newStatus === 'Resolved' ? new Date().toISOString() : null,
      };

      await axios.put(
        `/issues/status/${issueId}`,
        statusUpdate,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchIssues();
      fetchResolvedIssues();
    } catch (error) {
      console.error('Error updating status', error);
    }
  };

  const addComment = async (issueId, text) => {
    try {
      await axios.post(
        `/issues/comment/${issueId}`,
        { text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchIssues();
    } catch (error) {
      console.error('Error adding comment', error);
    }
  };

  useEffect(() => {
    fetchIssues();
    fetchResolvedIssues();
  }, []);

  const allIssues = [...issues];

  const uniqueCategories = ['all', ...new Set(allIssues.map(i => i.issueType))];

  const filteredIssues =
    categoryFilter === 'all'
      ? allIssues
      : allIssues.filter((i) => i.issueType === categoryFilter);

  const filteredIssuesByStatus =
    statusFilter === 'All'
      ? filteredIssues
      : filteredIssues.filter((i) => i.status === statusFilter);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-semibold text-gray-800">Reported Issues</h1>

      {/* Status Filter */}
      <div className="space-x-4 mb-4">
        <span className="font-semibold">Filter by Status:</span>
        {['All', 'Pending', 'In Progress'].map(status => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-full ${
              statusFilter === status
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Category Filter */}
      <div className="space-x-4 mb-6">
        <span className="font-semibold">Filter by Category:</span>
        {uniqueCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-4 py-2 rounded-full ${
              categoryFilter === cat
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Display Issues */}
      {filteredIssuesByStatus.length === 0 ? (
        <p>No issues found for this category and status.</p>
      ) : (
        filteredIssuesByStatus.map((issue) => (
          <div
            key={issue._id}
            className="bg-white p-4 rounded-lg shadow-lg border border-gray-300 space-y-4"
          >
            <h2 className="text-xl font-bold text-gray-800">{issue.issueType}</h2>
            <p className="text-gray-600">{issue.description}</p>

            {issue.image && (
              <img
                src={issue.image}
                alt="Issue"
                className="w-full max-w-md mx-auto rounded-lg"
              />
            )}

            <p className="text-sm text-gray-500">Status: <strong>{issue.status}</strong></p>

            <div>
              <button
                onClick={() => updateStatus(issue._id, 'Resolved')}
                className="mt-2 mr-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Mark Resolved
              </button>
              <button
                onClick={() => updateStatus(issue._id, 'In Progress')}
                className="mt-2 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                Mark In Progress
              </button>
            </div>

            {/* Comments */}
            <div>
              <h4 className="font-semibold text-gray-700">Comments:</h4>
              {issue.comments?.map((comment, i) => (
                <p key={i} className="text-gray-600">
                  <strong>{comment.sender}</strong>: {comment.text}
                </p>
              ))}
            </div>

            {/* Add Comment */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const text = e.target.comment.value;
                addComment(issue._id, text);
                e.target.reset();
              }}
              className="mt-4 space-y-2"
            >
              <input
                type="text"
                name="comment"
                placeholder="Add a comment"
                required
                className="w-full px-4 py-2 border rounded focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Submit Comment
              </button>
            </form>
          </div>
        ))
      )}
    </div>
  );
};

export default Issues;
