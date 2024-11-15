import express from "express";
import stationsRoutes from "./routes/stationsRoutes.js";
import previsionRoutes from "./routes/previsionRoutes.js";
import conditionRoutes from "./routes/conditionRoutes.js";
import AlerteRoutes from "./routes/alertRoutes.js";
import dotenv from "dotenv";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use("/api/", stationsRoutes);
app.use("/api/", previsionRoutes);
app.use("/api", conditionRoutes);
app.use("/api", AlerteRoutes);
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});