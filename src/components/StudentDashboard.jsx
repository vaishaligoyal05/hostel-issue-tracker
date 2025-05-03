import React, { useEffect, useState, useContext } from 'react';
import { getAllIssues } from '../api/issueApi';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { UserContext } from '../context/UserContext';

const StudentDashboard = () => {
  const [myIssues, setMyIssues] = useState([]);
  const [otherIssues, setOtherIssues] = useState([]);
  const { fetchUserProfile } = useContext(UserContext);

  const localUser = JSON.parse(localStorage.getItem('user'));
  const localUsername = localUser?.username;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const result = await getAllIssues(token);

        const allIssues = Array.isArray(result) ? result : result?.issues || [];

        if (!localUsername) {
          console.error('Username missing in localStorage');
          return;
        }

        const my = allIssues.filter(issue => issue.username === localUsername);
        const others = allIssues.filter(issue => issue.username !== localUsername);

        setMyIssues(my);
        setOtherIssues(others);
      } catch (err) {
        console.error('Error loading issues:', err);
      }
    };

    fetchData();
    fetchUserProfile();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Welcome to Mai Bhago Hostel</h1>

      {/* Report New Issue */}
      <section className="mb-8">
        <h2 className="font-semibold mb-2">Report an issue</h2>
        <Link to="/student/report">
          <div className="flex items-center gap-3 bg-gray-100 p-4 rounded-lg cursor-pointer hover:bg-gray-200 transition">
            <Plus />
            <div>
              <p className="font-medium">Report a new issue</p>
              <p className="text-sm text-gray-600">Let us know if something needs fixing.</p>
            </div>
          </div>
        </Link>
      </section>

      {/* Your Issues */}
      <section className="mb-8">
        <h2 className="font-semibold mb-2">Your issues</h2>
        {myIssues.length === 0 ? (
          <p className="text-gray-500 text-sm">You have not reported any issues yet.</p>
        ) : (
          myIssues.map(issue => (
            <Link to={`/student/issue/${issue._id}`} key={issue._id}>
              <div className="flex flex-col bg-gray-100 p-4 rounded-lg mb-3 hover:bg-gray-200 transition cursor-pointer">
                <div className="flex justify-between items-center mb-1">
                  <p className="font-semibold">{issue.issueType}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    issue.status === 'resolved' ? 'bg-green-100 text-green-800' :
                    issue.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    issue.status === 'on progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {issue.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{issue.description}</p>
              </div>
            </Link>
          ))
        )}
      </section>

      {/* Issues by Others */}
      <section>
        <h2 className="font-semibold mb-2">Issues raised by others</h2>
        {otherIssues.length === 0 ? (
          <p className="text-gray-500 text-sm">No issues from others yet.</p>
        ) : (
          otherIssues.map(issue => (
            <Link to={`/student/issue/${issue._id}`} key={issue._id}>
              <div className="flex flex-col bg-gray-100 p-4 rounded-lg mb-3 hover:bg-gray-200 transition cursor-pointer">
                <div className="flex justify-between items-center mb-1">
                  <p className="font-semibold">{issue.username} - {issue.issueType}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    issue.status === 'resolved' ? 'bg-green-100 text-green-800' :
                    issue.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    issue.status === 'on progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {issue.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{issue.description}</p>
              </div>
            </Link>
          ))
        )}
      </section>
    </div>
  );
};

export default StudentDashboard;
