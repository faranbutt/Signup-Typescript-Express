import express from 'express';
const router  = express.Router();
import { Login, SignUp } from '../controllers/AuthControllers';

// router.post("/signup",SignUp);
router.post("/signup",SignUp);
router.post("/login",Login);


export default router;