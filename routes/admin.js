const express = require('express');
const { body, validationResult } = require('express-validator');
const verifyToken = require('../middleware/auth');
const { upload } = require('../config/cloudinary');
const PageContent = require('../models/PageContent');
const Settings = require('../models/Settings');
const StaffMember = require('../models/StaffMember');
const Project = require('../models/Project');
const ContactSubmission = require('../models/ContactSubmission');

const router = express.Router();

router.use(verifyToken);

// ─── ME ────────────────────────────────────────────────────────────────────────

// GET /api/admin/me
router.get('/me', (req, res) => {
  res.json(req.admin);
});

// ─── DASHBOARD ─────────────────────────────────────────────────────────────────

// GET /api/admin/dashboard
router.get('/dashboard', async (req, res) => {
  try {
    const [pages, staff, projects, unreadContacts] = await Promise.all([
      PageContent.countDocuments(),
      StaffMember.countDocuments(),
      Project.countDocuments(),
      ContactSubmission.countDocuments({ isRead: false })
    ]);

    res.json({ pages, staff, projects, unreadContacts });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to load dashboard' });
  }
});

// ─── PAGE CONTENT ──────────────────────────────────────────────────────────────

// GET /api/admin/pages
router.get('/pages', async (req, res) => {
  try {
    const pages = await PageContent.find().sort({ pageName: 1 });
    res.json(pages);
  } catch (error) {
    console.error('Error fetching pages:', error);
    res.status(500).json({ error: 'Failed to fetch pages' });
  }
});

// GET /api/admin/pages/:pageName
router.get('/pages/:pageName', async (req, res) => {
  try {
    const page = await PageContent.findOne({ pageName: req.params.pageName });
    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }
    res.json(page);
  } catch (error) {
    console.error('Error fetching page:', error);
    res.status(500).json({ error: 'Failed to fetch page' });
  }
});

// POST /api/admin/pages
router.post('/pages', [
  body('pageName').trim().notEmpty().withMessage('Page name is required'),
  body('sections').isArray().withMessage('Sections must be an array')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { pageName, sections } = req.body;

    const existing = await PageContent.findOne({ pageName });
    if (existing) {
      return res.status(409).json({ error: 'Page already exists' });
    }

    const page = await PageContent.create({ pageName, sections });
    res.status(201).json(page);
  } catch (error) {
    console.error('Error creating page:', error);
    res.status(500).json({ error: 'Failed to create page' });
  }
});

// PUT /api/admin/pages/:pageName
router.put('/pages/:pageName', async (req, res) => {
  try {
    const { sections } = req.body;
    const page = await PageContent.findOneAndUpdate(
      { pageName: req.params.pageName },
      { sections },
      { new: true, runValidators: true }
    );

    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }

    res.json(page);
  } catch (error) {
    console.error('Error updating page:', error);
    res.status(500).json({ error: 'Failed to update page' });
  }
});

// POST /api/admin/pages/:pageName/image
router.post('/pages/:pageName/image', upload.single('image'), async (req, res) => {
  try {
    const { sectionName } = req.body;
    const page = await PageContent.findOne({ pageName: req.params.pageName });

    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }

    const section = page.sections.find(s => s.sectionName === sectionName);
    if (!section) {
      return res.status(404).json({ error: 'Section not found' });
    }

    section.imageUrl = req.file.path;
    section.imageAlt = req.body.imageAlt || '';
    await page.save();

    res.json(page);
  } catch (error) {
    console.error('Error uploading page image:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// DELETE /api/admin/pages/:pageName
router.delete('/pages/:pageName', async (req, res) => {
  try {
    const page = await PageContent.findOneAndDelete({ pageName: req.params.pageName });
    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }
    res.json({ message: 'Page deleted' });
  } catch (error) {
    console.error('Error deleting page:', error);
    res.status(500).json({ error: 'Failed to delete page' });
  }
});

// ─── SETTINGS ──────────────────────────────────────────────────────────────────

// PUT /api/admin/settings
router.put('/settings', async (req, res) => {
  try {
    const {
      businessName, address, city, state, zip,
      phone, email, website, socialLinks
    } = req.body;

    const settings = await Settings.findOneAndUpdate(
      {},
      { businessName, address, city, state, zip, phone, email, website, socialLinks },
      { new: true, upsert: true, runValidators: true }
    );

    res.json(settings);
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// ─── STAFF ─────────────────────────────────────────────────────────────────────

// GET /api/admin/staff
router.get('/staff', async (req, res) => {
  try {
    const staff = await StaffMember.find().sort({ displayOrder: 1 });
    res.json(staff);
  } catch (error) {
    console.error('Error fetching staff:', error);
    res.status(500).json({ error: 'Failed to fetch staff' });
  }
});

// POST /api/admin/staff
router.post('/staff', upload.single('photo'), [
  body('name').trim().notEmpty().withMessage('Name is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, title, bio, displayOrder, isActive } = req.body;
    const staffData = {
      name,
      title: title || '',
      bio: bio || '',
      displayOrder: displayOrder ? parseInt(displayOrder) : 0,
      isActive: isActive !== undefined ? isActive === 'true' || isActive === true : true
    };

    if (req.file) {
      staffData.photoUrl = req.file.path;
    }

    const member = await StaffMember.create(staffData);
    res.status(201).json(member);
  } catch (error) {
    console.error('Error creating staff member:', error);
    res.status(500).json({ error: 'Failed to create staff member' });
  }
});

// PUT /api/admin/staff/:id
router.put('/staff/:id', upload.single('photo'), async (req, res) => {
  try {
    const { name, title, bio, displayOrder, isActive } = req.body;
    const updateData = {};

    if (name !== undefined) updateData.name = name;
    if (title !== undefined) updateData.title = title;
    if (bio !== undefined) updateData.bio = bio;
    if (displayOrder !== undefined) updateData.displayOrder = parseInt(displayOrder);
    if (isActive !== undefined) updateData.isActive = isActive === 'true' || isActive === true;
    if (req.file) updateData.photoUrl = req.file.path;

    const member = await StaffMember.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!member) {
      return res.status(404).json({ error: 'Staff member not found' });
    }

    res.json(member);
  } catch (error) {
    console.error('Error updating staff member:', error);
    res.status(500).json({ error: 'Failed to update staff member' });
  }
});

// DELETE /api/admin/staff/:id
router.delete('/staff/:id', async (req, res) => {
  try {
    const member = await StaffMember.findByIdAndDelete(req.params.id);
    if (!member) {
      return res.status(404).json({ error: 'Staff member not found' });
    }
    res.json({ message: 'Staff member deleted' });
  } catch (error) {
    console.error('Error deleting staff member:', error);
    res.status(500).json({ error: 'Failed to delete staff member' });
  }
});

// ─── PROJECTS ──────────────────────────────────────────────────────────────────

// GET /api/admin/projects
router.get('/projects', async (req, res) => {
  try {
    const projects = await Project.find().sort({ category: 1, displayOrder: 1 });
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// POST /api/admin/projects
router.post('/projects', upload.single('image'), [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('category').isIn([
    'International Livestock Production',
    'Domestic Livestock Production',
    'Natural Resources Development',
    'Rural Development'
  ]).withMessage('Valid category is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { title, description, category, location, displayOrder, isActive } = req.body;
    const projectData = {
      title,
      description: description || '',
      category,
      location: location || '',
      displayOrder: displayOrder ? parseInt(displayOrder) : 0,
      isActive: isActive !== undefined ? isActive === 'true' || isActive === true : true
    };

    if (req.file) {
      projectData.imageUrl = req.file.path;
    }

    const project = await Project.create(projectData);
    res.status(201).json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// PUT /api/admin/projects/:id
router.put('/projects/:id', upload.single('image'), async (req, res) => {
  try {
    const { title, description, category, location, displayOrder, isActive } = req.body;
    const updateData = {};

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (location !== undefined) updateData.location = location;
    if (displayOrder !== undefined) updateData.displayOrder = parseInt(displayOrder);
    if (isActive !== undefined) updateData.isActive = isActive === 'true' || isActive === true;
    if (req.file) updateData.imageUrl = req.file.path;

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// DELETE /api/admin/projects/:id
router.delete('/projects/:id', async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json({ message: 'Project deleted' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// ─── CONTACTS ──────────────────────────────────────────────────────────────────

// GET /api/admin/contacts
router.get('/contacts', async (req, res) => {
  try {
    const contacts = await ContactSubmission.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
});

// PUT /api/admin/contacts/:id/read
router.put('/contacts/:id/read', async (req, res) => {
  try {
    const contact = await ContactSubmission.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({ error: 'Contact submission not found' });
    }

    res.json(contact);
  } catch (error) {
    console.error('Error marking contact as read:', error);
    res.status(500).json({ error: 'Failed to update contact' });
  }
});

// DELETE /api/admin/contacts/:id
router.delete('/contacts/:id', async (req, res) => {
  try {
    const contact = await ContactSubmission.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({ error: 'Contact submission not found' });
    }
    res.json({ message: 'Contact submission deleted' });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ error: 'Failed to delete contact' });
  }
});

module.exports = router;
