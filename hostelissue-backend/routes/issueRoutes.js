const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const verifyToken = require('../middleware/auth');
const Issue = require('../models/Issue');
const Comment = require('../models/Comment');

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// Test route
router.get('/test', (req, res) => {
  res.send('🟢 issueRoutes are working!');
});

// Get all active issues
router.get('/all', verifyToken, async (req, res) => {
  try {
    const issues = await Issue.find({ status: { $ne: 'Resolved' } }).sort({ createdAt: -1 });

    const formatted = await Promise.all(issues.map(async issue => {
      const comments = await Comment.find({ issueId: issue._id }).sort({ createdAt: 1 });
      return {
        ...issue.toObject(),
        image: issue.image ? `${req.protocol}://${req.get('host')}/uploads/${issue.image}` : null,
        comments: comments.map(c => ({
          text: c.text,
          sender: c.username,
          createdAt: c.createdAt,
        })),
      };
    }));

    res.status(200).json({ message: 'Active issues fetched', issues: formatted });
  } catch (err) {
    console.error('Error fetching issues:', err);
    res.status(500).json({ message: 'Server error while fetching issues' });
  }
});

// Get user's own issues
router.get('/mine', verifyToken, async (req, res) => {
  try {
    const issues = await Issue.find({ userId: req.user.userId }).sort({ createdAt: -1 });

    const formatted = await Promise.all(issues.map(async issue => {
      const comments = await Comment.find({ issueId: issue._id }).sort({ createdAt: 1 });
      return {
        ...issue.toObject(),
        image: issue.image ? `${req.protocol}://${req.get('host')}/uploads/${issue.image}` : null,
        comments: comments.map(c => ({
          text: c.text,
          sender: c.username,
          createdAt: c.createdAt,
        })),
      };
    }));

    res.status(200).json({ message: 'Your issues fetched', issues: formatted });
  } catch (err) {
    console.error('Error fetching your issues:', err);
    res.status(500).json({ message: 'Server error while fetching your issues' });
  }
});

// Report new issue
router.post('/report', verifyToken, upload.single('image'), async (req, res) => {
  const { issueType, floor, description } = req.body;
  const image = req.file ? req.file.filename : null;
  const { userId, username } = req.user;

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

    res.status(201).json({
      message: 'Issue reported successfully',
      issue: {
        ...newIssue.toObject(),
        image: image ? `${req.protocol}://${req.get('host')}/uploads/${image}` : null,
      },
    });
  } catch (err) {
    console.error('Issue reporting error:', err);
    res.status(500).json({ message: 'Server error while reporting issue' });
  }
});

// Update issue status
router.put('/status/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  let { status, resolvedAt } = req.body;

  // 🛑 Don't lowercase unless schema uses lowercase
  const validStatuses = ['Pending', 'In Progress', 'Resolved'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  try {
    const updateData = { status };
    if (status === 'Resolved') {
      updateData.resolvedAt = resolvedAt ? new Date(resolvedAt) : new Date(); // auto-set if not sent
    } else {
      updateData.resolvedAt = null; // clear if not resolved anymore
    }
    
    const updatedIssue = await Issue.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedIssue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    res.status(200).json({ message: 'Issue status updated', issue: updatedIssue });
  } catch (err) {
    console.error('Error updating issue status:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add comment
router.post('/comment/:issueId', verifyToken, async (req, res) => {
  const { text } = req.body;
  const { issueId } = req.params;
  const { userId, username } = req.user;

  if (!text) {
    return res.status(400).json({ message: 'Comment text is required' });
  }

  try {
    const issue = await Issue.findById(issueId);
    if (!issue) return res.status(404).json({ message: 'Issue not found' });

    const comment = new Comment({ issueId, userId, username, text });
    await comment.save();

    res.status(201).json({ message: 'Comment added successfully', comment });
  } catch (err) {
    console.error('Error adding comment:', err);
    res.status(500).json({ message: 'Server error while adding comment' });
  }
});

// Edit comment
router.put('/comment/:commentId', verifyToken, async (req, res) => {
  const { text } = req.body;
  const { commentId } = req.params;

  if (!text) return res.status(400).json({ message: 'Comment text is required' });

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    if (comment.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to edit this comment' });
    }

    comment.text = text;
    await comment.save();

    res.status(200).json({ message: 'Comment updated successfully', comment });
  } catch (err) {
    console.error('Error updating comment:', err);
    res.status(500).json({ message: 'Server error while updating comment' });
  }
});

// Delete comment
router.delete('/comment/:commentId', verifyToken, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    if (comment.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    await comment.deleteOne();
    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (err) {
    console.error('Error deleting comment:', err);
    res.status(500).json({ message: 'Server error while deleting comment' });
  }
});

// Get comments for an issue
router.get('/comments/:issueId', verifyToken, async (req, res) => {
  try {
    const comments = await Comment.find({ issueId: req.params.issueId }).sort({ createdAt: 1 });
    res.status(200).json({ message: 'Comments fetched', comments });
  } catch (err) {
    console.error('Error fetching comments:', err);
    res.status(500).json({ message: 'Server error while fetching comments' });
  }
});

// Get resolved issues with optional date filtering
// Get resolved issues with optional date filtering
router.get('/history', verifyToken, async (req, res) => {
  try {
    let { from, to } = req.query;
    const query = { status: { $regex: /^resolved$/i } }; 

    if (from || to) {
      query.resolvedAt = {};
      if (from) query.resolvedAt.$gte = new Date(from);
      if (to) query.resolvedAt.$lte = new Date(to);
    }

    const resolvedIssues = await Issue.find(query).sort({ resolvedAt: -1 });

    const formatted = await Promise.all(resolvedIssues.map(async issue => {
      const comments = await Comment.find({ issueId: issue._id }).sort({ createdAt: 1 });

      return {
        ...issue.toObject(),
        resolvedAt: issue.resolvedAt,
        image: issue.image ? `${req.protocol}://${req.get('host')}/uploads/${issue.image}` : null,
        comments: comments.map(c => ({
          text: c.text,
          sender: c.username,
          createdAt: c.createdAt,
        })),
      };
    }));

    res.status(200).json({ message: 'Resolved issues fetched', issues: formatted });
  } catch (err) {
    console.error('Error fetching resolved issues:', err);
    res.status(500).json({ message: 'Server error while fetching history' });
  }
});

// Get single issue with comments
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: 'Issue not found' });

    const comments = await Comment.find({ issueId: req.params.id }).sort({ createdAt: 1 });

    res.status(200).json({
      issue: {
        ...issue.toObject(),
        image: issue.image ? `${req.protocol}://${req.get('host')}/uploads/${issue.image}` : null,
      },
      comments,
    });
  } catch (err) {
    console.error('Error fetching issue:', err);
    res.status(500).json({ message: 'Server error while fetching issue' });
  }
});

module.exports = router;
