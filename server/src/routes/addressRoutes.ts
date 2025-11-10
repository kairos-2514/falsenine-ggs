import express from "express";
import {
  createOrUpdateAddress,
  getUserAddress,
} from "../controllers/userAddressController";

const router = express.Router();

router.post("/", createOrUpdateAddress);
router.get("/:userId", getUserAddress);

export default router;

