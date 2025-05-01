import express from "express";
import cors from "cors";
import scrapeRoutes from "./src/routes/scrape.route";


const app = express();
const PORT = 3000;

app.use(cors({ origin: "*", optionsSuccessStatus: 200 }));
app.use("/api", scrapeRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
