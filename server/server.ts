import "dotenv/config";
import createServer from "./utils/createServer";
import { DBConnect, memoryConnect } from "./utils/DB";
import createMockData from "./tests/mock/createMockData";

const app = createServer();

app.listen(process.env.APIPORT, async () => {
  console.log(
    `server listening on port: http://localhost:${process.env.APIPORT}`
  );
  const mongoUri = process.env.MONGOURI;
  if (mongoUri) {
    DBConnect(mongoUri);
  } else {
    await memoryConnect();
    await createMockData();
  }
});
