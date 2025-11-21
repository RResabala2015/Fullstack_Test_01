import app from "./app";
import sequelize from "./config/db";
import dotenv from "dotenv";

dotenv.config({
  path: process.env.NODE_ENV === "test" ? ".env.test.local" : ".env",
});

const PORT = process.env.PORT || 3000;

sequelize
  .sync({ alter: true }) // o .sync({ force: false })
  .then(() => console.log("Database synchronized"))
  .catch(err => console.error("Error initializing DB:", err));

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
}
