import express from 'express';
import { deleteUser, getUserbyId, getUsers, signout, updateUser } from '../controllers/userController.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.put("/update/:userId",verifyToken, updateUser);
router.delete("/delete/:userId", verifyToken, deleteUser);
router.post("/signout",signout);
router.get("/getusers",verifyToken,getUsers);
router.get("/:userId",getUserbyId);

export default router;