import express from "express"
import {google, signin,signup} from '../controllers/authController.js'

const router = express.Router();

// Add logging middleware
router.use((req, res, next) => {
  console.log(`Auth Route: ${req.method} ${req.path}`);
  next();
});

router.post("/signup",signup)
router.post("/signin",signin)
router.post("/google",google)

export default router