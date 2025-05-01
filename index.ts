import express from "express";
import cors from "cors";
import scrapeRoutes from "./src/routes/scrape.route";

const app = express();
const PORT = 3000; // In a real project, this should go in a .env file

app.use(cors({ origin: "*", optionsSuccessStatus: 200 })); // This is enabled for all origins, but you should restrict it to your frontend domain in production
app.use("/api", scrapeRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
