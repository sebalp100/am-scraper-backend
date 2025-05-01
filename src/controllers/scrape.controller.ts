import axios from "axios";
import { JSDOM } from "jsdom";
import type { Product } from "../models/productModel";
import type { Request, Response } from "express";

export const scrapeAmazon = async (req: Request, res: Response): Promise<void> => {
  const keyword = req.query.keyword as string;
  
  if (!keyword) {
    res.status(400).json({ error: "Missing 'keyword' query parameter" });
    return;
  }

  const searchUrl = `https://www.amazon.com/s?k=${(keyword)}`;

  try {
    const { data: html } = await axios.get(searchUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Connection": "keep-alive",
        "DNT": "1",
        "Upgrade-Insecure-Requests": "1",
        "Referer": "https://www.google.com/"
      }
    });

    const dom = new JSDOM(html);
    const document = dom.window.document;
    const items = document.querySelectorAll('div[role="listitem"]');

    if (items.length === 0) {
      res.status(404).json({ error: "No items found" });
      return;
    }

    const results: Product[] = [];

    items.forEach(item => {
      const imageElement = item.querySelector('img[class="s-image"]');
      const titleElement = item.querySelector('div[data-cy="title-recipe"] > a h2[aria-label]');
      const ratingElement = item.querySelector('div[data-cy="reviews-block"] > div > span > a[aria-label]');
      const reviewsNumberElement = item.querySelector('div[data-cy="reviews-block"] > div > span[class="rush-component"] > div > a[aria-label]');

      if (titleElement) {
        const title = titleElement.getAttribute("aria-label") || "No title found";
        const rating = ratingElement?.getAttribute("aria-label")?.split(",")[0].trim() || "No rating";
        const reviewsNumber = reviewsNumberElement?.getAttribute("aria-label") || "0 reviews";
        const imageUrl = imageElement?.getAttribute("src") || "";

        results.push({ title, rating, reviewsNumber, imageUrl });
      }
    });

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to scrape Amazon" });
  }
};
