import Express, { type Request, type Response } from "express";
import ENV from "@/utils/env";
import { success } from "@/utils/responses";
// import cors from "cors";
import ViteExpress from "vite-express";

// routes
import authRouter from "@/routes/auth.route";
import uploadRouter from "@/routes/upload.route";
import categoryRouter from "@/routes/category.route";
import itemRouter from "@/routes/item.route";

// sitemap handler
import { sitemapHandler } from "@/handlers/sitemap.handler";

const app = Express();

app.use(Express.json());
// app.use(cors());
app.use("/api/public", Express.static("public/")); // serve static files

app.get("/api/", async (req: Request, res: Response) => {
  success(res, "Hello World!");
});

// routes
app.use("/api/auth", authRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/category", categoryRouter);
app.use("/api/item", itemRouter);

// inject sitemap xml generated from db
app.get("/sitemap.xml", sitemapHandler);

// app.get("*", (req, res) => {
//   return notFound(res, "Page not found");
// });

// // vite app
// app.use(Express.static("viteDist/"));

// app.get("*", (req, res) => {
//   const indexFile = path.resolve("viteDist/index.html");
//   fs.readFile(indexFile, "utf-8", (err, data) => {
//     if (err) {
//       return notFound(res, "Page not found");
//     }

//     return res.send(data);
//   });
// });

// app.listen(ENV.APP_PORT, () => {
//   console.log(`⚡ Server running on port ${ENV.APP_PORT}`);
// });

ViteExpress.config({
  mode: "production",
  inlineViteConfig: {
    build: {
      outDir: "static/",
    },
  },
});

ViteExpress.listen(app, ENV.APP_PORT, () => {
  console.log(`⚡ Server running on port ${ENV.APP_PORT}`);
});
