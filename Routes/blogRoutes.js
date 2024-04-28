import express from 'express';
import * as blogController from '../controllers/blogController.js';
const router = express.Router();
import UserModel from "../Models/userModel.js";


//Route for getting all blogs
router.get('/',blogController.getAllBlogs);
//Route for getting a blog by ID
router.get('/:id',blogController.getBlogID);
//Route for creating a new blog post
router.post('/',blogController.createBlogPost);
//router for liking a blog post
router.put('/like/:id',blogController.likeBlogPost);
//route for adding a comment
router.post('like/:id',blogController.addBlogComment);
//Route for liking a blog comment
router.put('/:id/comment/like/:commentIndex',blogController.likeBlogComment);
//route for deleting a blog post
router.get('/:id',blogController.deleteBlogPost);

export default router;

