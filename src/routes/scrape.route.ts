import { Router } from "express";
import { scrapeAmazon } from "../controllers/scrape.controller";


const router = Router();

router.get("/scrape", scrapeAmazon);

export default router;
