const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// @route   POST api/contacts
// @desc    Create a new contact submission
// @access  Public
router.post('/', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        
        // Simple validation
        if (!name || !email || !message) {
            return res.status(400).json({ msg: 'Please enter all fields' });
        }
        
        // Create new contact
        const newContact = new Contact({
            name,
            email,
            message
        });
        
        // Save contact to database
        const savedContact = await newContact.save();
        
        res.status(201).json(savedContact);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/contacts
// @desc    Get all contact submissions
// @access  Private (Admin only)
router.get('/', [auth, admin], async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ date: -1 });
        res.json(contacts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/contacts/:id
// @desc    Get contact by ID
// @access  Private (Admin only)
router.get('/:id', [auth, admin], async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);
        
        if (!contact) {
            return res.status(404).json({ msg: 'Contact not found' });
        }
        
        res.json(contact);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Contact not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/contacts/:id
// @desc    Delete a contact
// @access  Private (Admin only)
router.delete('/:id', [auth, admin], async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);
        
        if (!contact) {
            return res.status(404).json({ msg: 'Contact not found' });
        }
        
        await contact.remove();
        
        res.json({ msg: 'Contact removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Contact not found' });
        }
        res.status(500).send('Server Error');
    }
});

module.exports = router;