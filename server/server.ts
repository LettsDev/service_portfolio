require("dotenv").config();
import createServer from "./utils/createServer";
import { DBConnect, memoryConnect } from "./utils/DB";
import createMockData from "./tests/mock/createMockData";

const app = createServer();
const nodeEnv = process.env.NODE_ENV;
if (nodeEnv === "production" && process.env.HOST_NAME && process.env.PORT) {
  app.listen(+process.env.PORT, process.env.HOST_NAME, () => {
    console.log(
      `server running at http://${process.env.HOST_NAME}:${process.env.PORT}/`
    );
  });
  const mongoUri = process.env.DATABASE_URL;

  if (mongoUri) {
    DBConnect(mongoUri);
  } else {
    console.log("cannot find DB URL");
  }
} else {
  app.listen(process.env.APIPORT, async () => {
    console.log(
      `server listening on port: http://localhost:${process.env.APIPORT}`
    );
    await memoryConnect();
    await createMockData();
  });
}
