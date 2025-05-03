import axios from './axios';

// Student Login API
export const loginUser = async (credentials) => {
  const response = await axios.post('/auth/login', credentials);
  return response.data;
};

// Report an Issue
export const reportIssue = async (formData, token) => {
  const response = await axios.post('/issues/report', formData, {
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

// Get All Issues
export const getAllIssues = async (token) => {
  const response = await axios.get('/issues/all', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// Update Issue Status
export const updateIssueStatus = async (issueId, status, token) => {
  const response = await axios.put(`/issues/update-status/${issueId}`, { status }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// Add Comment
export const addComment = async (issueId, text, token) => {
  const response = await axios.post(`/issues/comment/${issueId}`, { text }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// Get Comments for Issue
export const getComments = async (issueId, token) => {
  const response = await axios.get(`/issues/comments/${issueId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};
