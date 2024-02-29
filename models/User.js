const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true }, // Add this line
    firstName: String,
    lastName: String,
    age: Number,
    country: String,
    gender: String,
    role: { type: String, default: 'regular user' },
    creationDate: { type: Date, default: Date.now }
});

UserSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8);
    }
    next();
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
