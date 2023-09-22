import "dotenv/config";
import createServer from "./utils/createServer";

const app = createServer();

app.listen(process.env.APIPORT, async () => {
  console.log(
    `server listening on port: http://localhost:${process.env.APIPORT}`
  );
});
