import app from "./src/app.js";
import connectTODB from "./src/config/database.js";

connectTODB();

app.listen(3000, () => {
  console.log("server is running.........");
});
