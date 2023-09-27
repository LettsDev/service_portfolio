import "dotenv/config";
import createServer from "./utils/createServer";
import { memoryConnect } from "./utils/DB";
import createMockData from "./tests/mock/createMockData";

const app = createServer();

app.listen(process.env.APIPORT, async () => {
  console.log(
    `server listening on port: http://localhost:${process.env.APIPORT}`
  );
  await memoryConnect();
  await createMockData();
});
