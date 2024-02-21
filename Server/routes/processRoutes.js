import express from "express";

import {allProcess, terminate} from '../controller/processController.js'
import processLogs from "../controller/processLog.js";

const router = express.Router();

router.get("/runningprocess",allProcess );
router.post("/terminateprocess",terminate)

router.get("/log",processLogs)

export default router;
