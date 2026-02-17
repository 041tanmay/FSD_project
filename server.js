const express = require('express');
const mongoose = require('mongoose');
const Signup = require('./models/signup.models.js');

require('dotenv').config();

const app = express();
const PORT = 5000;

app.use(express.json());

app.get('/api/signup', async (req, res) => {
    try {
        const user = await Signup.find();
        if(user.length === 0){
            return res.status(404).json({ message: "Username should contains atleast 6 characters" });
        }
        return res.status(200).json({ message: "User data found", user: user });
    } catch (err) {
        return res.status(500).json({ message: "No user found", error: err.message });
    }
})

app.post('/api/signup', async (req, res) => {
    try {
        const {name, email, username, password} = req.body;

        if(!name || !email || !username || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        // password validation
        const minlength = password.length;
        if(minlength <6){
            return res.status(400).json({ message: "Password should contains atleast 6 characters" });
        }
        const newUser = new Signup({ 
            name,
            email,
            username,
            password
        });
        await newUser.save();
        res.status(201).json({ message: "new user created", user: newUser });

    } catch (err) {
        return res.status(500).json({ message: "cannot post a user", error: err.message });
    }
})


mongoose.connect(process.env.DB_URI)
    .then( () => {
        console.log('Connected to MongoDB');
    })
    .catch( (err) => {
        console.error('Error connecting to MongoDB', err.message);
    });

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});