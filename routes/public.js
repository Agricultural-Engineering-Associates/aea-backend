const express = require('express');
const { body, validationResult } = require('express-validator');
const { Resend } = require('resend');
const Settings = require('../models/Settings');
const PageContent = require('../models/PageContent');
const StaffMember = require('../models/StaffMember');
const Project = require('../models/Project');
const ContactSubmission = require('../models/ContactSubmission');

const router = express.Router();

// GET /api/public/settings
router.get('/settings', async (req, res) => {
  try {
    const settings = await Settings.get();
    if (!settings) {
      return res.json({});
    }
    res.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// GET /api/public/pages/:pageName
router.get('/pages/:pageName', async (req, res) => {
  try {
    const page = await PageContent.findByPageName(req.params.pageName);
    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }
    res.json(page);
  } catch (error) {
    console.error('Error fetching page:', error);
    res.status(500).json({ error: 'Failed to fetch page' });
  }
});

// GET /api/public/staff
router.get('/staff', async (req, res) => {
  try {
    const staff = await StaffMember.getAll(true);
    res.json(staff);
  } catch (error) {
    console.error('Error fetching staff:', error);
    res.status(500).json({ error: 'Failed to fetch staff' });
  }
});

// GET /api/public/projects
router.get('/projects', async (req, res) => {
  try {
    const projects = await Project.getAll(true);
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// POST /api/public/contact
router.post('/contact', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('subject').trim().notEmpty().withMessage('Subject is required'),
  body('message').trim().notEmpty().withMessage('Message is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, email, subject, message } = req.body;

    const submission = await ContactSubmission.create({
      name,
      email,
      subject,
      message
    });

    if (process.env.RESEND_API_KEY) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: 'AEA Contact Form <onboarding@resend.dev>',
          to: process.env.CONTACT_EMAIL,
          subject: `Contact Form: ${subject}`,
          html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
          `
        });
      } catch (emailError) {
        console.error('Failed to send email notification:', emailError);
      }
    }

    res.status(201).json({ message: 'Message sent successfully', id: submission.id });
  } catch (error) {
    console.error('Error saving contact submission:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

module.exports = router;
