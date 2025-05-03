const Issue = require('../models/Issue');
const Comment = require('../models/Comment');

exports.getAllIssues = async (req, res) => {
  try {
    const issues = await Issue.find().sort({ createdAt: -1 });
    const formatted = await Promise.all(
      issues.map(async (issue) => {
        const comments = await Comment.find({ issueId: issue._id }).sort({ createdAt: 1 });
        return {
          ...issue._doc,
          image: issue.image ? `${req.protocol}://${req.get('host')}/uploads/${issue.image}` : null,
          comments: comments.map(c => ({
            text: c.text,
            sender: c.username,
            createdAt: c.createdAt,
          })),
        };
      })
    );
    res.status(200).json(formatted);
  } catch (err) {
    console.error('Error fetching issues:', err);
    res.status(500).json({ message: 'Server error while fetching issues' });
  }
};

exports.getMyIssues = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const issues = await Issue.find({ userId }).sort({ createdAt: -1 });
    const formatted = await Promise.all(
      issues.map(async (issue) => {
        const comments = await Comment.find({ issueId: issue._id }).sort({ createdAt: 1 });
        return {
          ...issue._doc,
          image: issue.image ? `${req.protocol}://${req.get('host')}/uploads/${issue.image}` : null,
          comments: comments.map(c => ({
            text: c.text,
            sender: c.username,
            createdAt: c.createdAt,
          })),
        };
      })
    );
    res.status(200).json(formatted);
  } catch (err) {
    console.error('Error fetching your issues:', err);
    res.status(500).json({ message: 'Server error while fetching your issues' });
  }
};

exports.reportIssue = async (req, res) => {
  const { userId, username } = req.user;
  const { issueType, floor, description } = req.body;
  const image = req.file ? req.file.filename : null;

  if (!issueType || !floor || !description) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const newIssue = new Issue({
      userId,
      username,
      issueType,
      floor,
      description,
      image,
      status: 'Pending',
    });

    await newIssue.save();

    const returnedIssue = {
      ...newIssue._doc,
      image: image ? `${req.protocol}://${req.get('host')}/uploads/${image}` : null,
    };

    res.status(201).json({ message: 'Issue reported successfully', issue: returnedIssue });
  } catch (err) {
    console.error('Error reporting issue:', err);
    res.status(500).json({ message: 'Server error while reporting issue' });
  }
};

exports.updateIssueStatus = async (req, res) => {
  const { status, resolvedAt } = req.body;

  try {
    const updateData = { status };
    if (status === 'Resolved' && resolvedAt) {
      updateData.resolvedAt = resolvedAt;
    }

    const updatedIssue = await Issue.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedIssue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    res.status(200).json({ message: 'Status updated successfully', issue: updatedIssue });
  } catch (err) {
    console.error('Error updating status:', err);
    res.status(500).json({ message: 'Error updating status' });
  }
};

exports.addComment = async (req, res) => {
  const { text } = req.body;
  const { userId, username } = req.user;
  const { issueId } = req.params;

  if (!text) {
    return res.status(400).json({ message: 'Comment text is required' });
  }

  try {
    const comment = new Comment({ issueId, userId, username, text });
    await comment.save();
    res.status(201).json({ message: 'Comment added successfully', comment });
  } catch (err) {
    console.error('Error adding comment:', err);
    res.status(500).json({ message: 'Error adding comment' });
  }
};

exports.getComments = async (req, res) => {
  const { issueId } = req.params;

  try {
    const comments = await Comment.find({ issueId }).sort({ createdAt: 1 });
    res.status(200).json(comments);
  } catch (err) {
    console.error('Error fetching comments:', err);
    res.status(500).json({ message: 'Error fetching comments' });
  }
};
