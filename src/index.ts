import Express, { type Request, type Response } from "express";
import ENV from "@/utils/env";
import { success } from "./utils/responses";

const app = Express();
app.use(Express.json());

app.get("/", async (req: Request, res: Response) => {
  res.json(success("Hello World!"));
});

app.listen(ENV.APP_PORT, () => {
  console.log(`⚡ Server running on port ${ENV.APP_PORT}`);
});
