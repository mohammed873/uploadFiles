const router = require('express').Router();
const cloudinary = require('../utils/cloudinary')
const upload = require('../utils/multer')
const User = require('../models/user')


// add new user
router.post('/' ,  upload.single('image'), async (req, res) => {
    try{
      const result = await cloudinary.uploader.upload(req.file.path);
      
      // Crete an instance of user object
      let user = new User({
          fullName : req.body.fullName,
          profilePicture : result.secure_url ,
          cloudinary_id : result.public_id,
      })

      //save user into Db 
      await user.save();

      res.status(201).json({ 
        succes : true,
        message : 'User saved successfully',
        user
      })
    } catch(err) {
        res.status(500).json({ 
        succes : false,
        message : err,
      })
    } 
})

//fetch all users
router.get('/' ,  async (req, res) => {
    try{
      let users = await User.find();

      res.status(200).json({ 
        succes : true,
        users
      })
    } catch(err) {
        res.status(500).json({ 
            succes : false,
            message : err,
      })
    } 
})

//fetch a single user by id
router.get('/:id' ,  async (req, res) => {
    try{
      let user = await User.findById(req.params.id);

      res.status(200).json({ 
        succes : true,
        user
      })
    } catch(err) {
        res.status(500).json({ 
            succes : false,
            message : err,
      })
    } 
})

//delted a single user by id
router.delete('/:id' ,  async (req, res) => {
    try{
       //find user by id first  
      let user = await User.findById(req.params.id);

      // delete user profile image from cloudinary 
      await cloudinary.uploader.destroy(user.cloudinary_id);

      //delte user from database
      await user.remove();
      
      res.status(200).json({ 
        succes : true,
        message : 'User deleted successfully'
      })
    } catch(err) {
        res.status(500).json({ 
            succes : false,
            message : err,
        })
    } 
})

//update a single user info by id
router.put('/:id' , upload.single("image"),  async (req, res) => {
  try {
      let user = await User.findById(req.params.id);

      await cloudinary.uploader.destroy(user.cloudinary_id);

      const result = await cloudinary.uploader.upload(req.file.path);

      const data = {
          fullName : req.body.fullName || user.fullName,
          profilePicture : result.secure_url || user.profilePicture,
          cloudinary_id : result.public_id || user.cloudinary_id,
      }

      user = await User.findByIdAndUpdate(req.params.id, data , {new : true});

      res.status(200).json({ 
        succes : true,
        message : 'User info updated successfully',
        user
      })
      
  } catch (err) {
    res.status(500).json({ 
        succes : false,
        message : err,
      })
  }
})


module.exports = router