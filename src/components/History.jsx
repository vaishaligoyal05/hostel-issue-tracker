import axios from '../api/axios';
import { useEffect, useState } from 'react';

const History = () => {
  const [resolvedIssues, setResolvedIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [token] = useState(localStorage.getItem('token'));
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const fetchResolvedIssues = async () => {
    try {
      const response = await axios.get('/issues/history', {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Ensure issues array is properly extracted
      const issues = response.data.issues || response.data;
      setResolvedIssues(issues);
      setFilteredIssues(issues);
    } catch (error) {
      console.error('Error fetching resolved issues', error);
    }
  };

  const filterByDate = () => {
    if (!fromDate || !toDate) return;

    const from = new Date(fromDate);
    const to = new Date(toDate);

    const filtered = resolvedIssues.filter(issue => {
      const resolved = new Date(issue.resolvedAt);
      return resolved >= from && resolved <= to;
    });

    setFilteredIssues(filtered);
  };

  useEffect(() => {
    fetchResolvedIssues();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-semibold text-gray-800">Resolved Issues</h1>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <label className="text-sm text-gray-600">
          From:
          <input
            type="date"
            className="ml-2 p-2 border border-gray-300 rounded"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </label>

        <label className="text-sm text-gray-600">
          To:
          <input
            type="date"
            className="ml-2 p-2 border border-gray-300 rounded"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </label>

        <button
          onClick={filterByDate}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Filter
        </button>
      </div>

      {filteredIssues.length === 0 ? (
        <p>No resolved issues found.</p>
      ) : (
        filteredIssues.map((issue) => (
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

            <div className="space-y-2">
              <h4 className="font-semibold text-gray-700">Comments:</h4>
              {issue.comments.map((comment, i) => (
                <p key={i} className="text-gray-600">
                  <strong>{comment.sender}</strong>: {comment.text}
                </p>
              ))}
            </div>

            <p className="text-gray-500 text-sm">
              Resolved At: {new Date(issue.resolvedAt).toLocaleString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default History;
