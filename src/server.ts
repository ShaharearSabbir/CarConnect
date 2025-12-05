import app from "./app";
import config from "./config";

const port = config.PORT;

app.listen(port, () => {
  console.log(`server is running on http://localhost:${port}`);
});
