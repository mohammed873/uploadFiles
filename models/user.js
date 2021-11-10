const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    fullName : {
        type : 'string',
    },
    profilePicture : {
        type : 'string',
    },
    cloudinary_id : {
        type : 'string',
    }
});

module.exports = mongoose.model('User', userSchema);