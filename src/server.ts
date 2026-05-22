import app from "./app/app.js";
import config from "./app/config/env.config.js";

app.listen(config.port, ():void => {
  console.log(`Server is running on http://localhost:${config.port}`);
});