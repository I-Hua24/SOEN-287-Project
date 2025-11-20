// admin dashboard
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import RoomModel from "../model/roomModel.js";

import { verifyTokenMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.get("/adminDashboard", (req, res) => {

    //   const day = atMidnight();
    //    /* await */ ensureSeedFor(day, "study", 10);

    res.sendFile(path.join(__dirname, "../../pages/adminDashboard.html"));
});

export default router;
