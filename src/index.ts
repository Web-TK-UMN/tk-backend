import Express, { type Request, type Response } from "express";
import ENV from "@/utils/env";
import { notFound, success } from "./utils/responses";

// routes
import authRouter from "@/routes/auth.route";
import uploadRouter from "@/routes/upload.route";
import categoryRouter from "@/routes/category.route";
import itemRouter from "@/routes/item.route";

const app = Express();

app.use(Express.json());
app.use("/public", Express.static("public/")); // serve static files

app.get("/", async (req: Request, res: Response) => {
  success(res, "Hello World!");
});

// routes
app.use("/auth", authRouter);
app.use("/upload", uploadRouter);
app.use("/category", categoryRouter);
app.use("/item", itemRouter);

app.get("*", (req, res) => {
  return notFound(res, "Page not found");
});

app.listen(ENV.APP_PORT, () => {
  console.log(`⚡ Server running on port ${ENV.APP_PORT}`);
});
