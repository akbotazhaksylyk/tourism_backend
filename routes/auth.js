const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Publication = require('../models/Publication');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const sendEmail = require('../config/mailer');
const axios = require('axios');
const search_locations = require('../api/search-locations');
const fetch = require('node-fetch');


// Route to display the registration form
router.get('/register', (req, res) => {
    res.render('register');
});

// Route to handle the registration form submission
router.post('/register', async (req, res) => {
    try {
        // Use the User model to create a new user with the form data
        const { username, password, email, firstName, lastName, age, country, gender } = req.body;
        const newUser = new User({ username, password, email, firstName, lastName, age, country, gender });

        // Save the new user to the database
        await newUser.save();

        sendEmail(
            req.body.email, // Assuming the user's email is sent in the request body
            'Welcome to Merey Travel!',
            '<h1>Welcome!</h1><p>Thank you for registering with Merey Travel. We are excited to have you on board.</p>'
        );

        // Redirect to the login page or wherever you want
        res.redirect('/login');
    } catch (error) {
        // Handle errors, such as username already taken, validation errors, etc.
        res.status(500).send(error.message);
    }
});

// Route to display the login form
router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/home', // redirect to the secure home page
    failureRedirect: '/login', // redirect back to the login page if there is an error
    failureFlash: true // allow flash messages
}));

router.get('/home', async (req, res) => {
    console.log(req.user);
    try {
        const publications = await Publication.find({});
        // Assuming req.user is set correctly after login
        res.render('home', {
            user: req.user, // This needs to be correctly set in your authentication logic
            publications: publications
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error loading the page.");
    }
});

router.post('/create-publication', async (req, res) => {
    console.log(req.body)
    const { name, description } = req.body; // Extract name and description from the form submission
    try {
        const newPublication = new Publication({
            name,
            description
            // createdAt will be automatically set to the current date/time
        });
        await newPublication.save(); // Save the new publication to the database

        res.redirect('/home'); // Redirect to the home page or to a confirmation page
    } catch (error) {
        console.error('Error creating publication:', error);
        res.status(500).send('Error creating the publication');
    }
});

router.post('/delete-publication/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Publication.findByIdAndDelete(id); // Change this line
        res.redirect('/home'); // Redirect back to the home page or wherever appropriate
    } catch (error) {
        console.error('Error deleting publication:', error);
        res.status(500).send('Error deleting the publication');
    }
});

// Route to show the edit form
router.get('/edit-publication/:id', async (req, res) => {
    try {
        const publication = await Publication.findById(req.params.id);
        res.render('edit-publication', { publication }); // Assuming you have an EJS template named edit-publication.ejs
    } catch (error) {
        console.error('Error fetching publication for edit:', error);
        res.status(500).send('Error fetching publication for edit');
    }
});

// Route to update the publication
router.post('/update-publication/:id', async (req, res) => {
    const { name, description } = req.body;
    try {
        await Publication.findByIdAndUpdate(req.params.id, { name, description });
        res.redirect('/home'); // Or wherever you want to redirect after updating
    } catch (error) {
        console.error('Error updating publication:', error);
        res.status(500).send('Error updating the publication');
    }
});

router.get('/contact', (req, res) => {
    res.render('contact', { title: 'Contact Us', apiKey: 'AIzaSyCSTHLQdgxdhm4MUzJQNFBci-V6yte0RaQ' });
})


router.get('/plan-vacation', (req, res) => {
    res.render('plan-vacation');
});

router.get('/profile', (req, res) => {
    // Assume `req.user` contains the logged-in user's information
    // You may need to adjust this logic based on your actual user authentication setup
    if (req.isAuthenticated()) { // Assuming you are using passport.js for authentication
        res.render('profile', {
            user: req.user // Pass the logged-in user's information to the template
        });
    } else {
        res.redirect('/login'); // Redirect to login page if the user is not authenticated
    }
});



module.exports = router;
