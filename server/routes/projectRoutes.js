const express = require('express');
const Project = require('../models/Project');
const router = express.Router();

const toProjectDto = (project) => ({
  id: project._id.toString(),
  userId: project.userId,
  title: project.title,
  description: project.description,
  images: project.images,
  completionDate: project.completionDate,
  createdAt: project.createdAt,
});

// GET /api/projects
// Get projects for a specific user
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: 'UserId is required' });
    }
    const projects = await Project.find({ userId }).sort({ createdAt: -1 });
    res.json(projects.map(toProjectDto));
  } catch (err) {
    console.error('Error fetching projects:', err);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// POST /api/projects
// Create a new project
router.post('/', async (req, res) => {
  try {
    const { userId, title, description, images, completionDate } = req.body;
    
    if (!userId || !title || !description) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const project = new Project({
      userId,
      title,
      description,
      images: images || [],
      completionDate,
    });

    await project.save();
    res.status(201).json(toProjectDto(project));
  } catch (err) {
    console.error('Error creating project:', err);
    res.status(400).json({ error: 'Failed to create project' });
  }
});

// DELETE /api/projects/:id
// Delete a project
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByIdAndDelete(id);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    console.error('Error deleting project:', err);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

module.exports = router;
