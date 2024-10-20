import connectDB from "./db/index.db.js";
import { app } from "./app.js";

connectDB()
  .then(
    app.listen(process.env.PORT || 3333, () => {
      console.log(`Server is running on PORT, ${process.env.PORT}`);
    })
  )
  .catch((error) =>
    console.error("Mongo DB connection error in Index.js", error)
  );
