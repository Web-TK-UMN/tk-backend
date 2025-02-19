import { Response, Request } from "express";
import db from "@/services/db";
import { element, renderToString } from "@shun-shobon/littlexml";
import ENV from "@/utils/env";

export const sitemapHandler = async (req: Request, res: Response) => {
  const baseUrl = ENV.APP_BASE_URL;

  const data = await db.item.findMany({
    select: {
      Category: {
        select: {
          slug: true,
        },
      },
      updatedAt: true,
      slug: true,
    },
  });

  const root = element("urlset")
    .attr("xmlns", "http://www.sitemaps.org/schemas/sitemap/0.9")
    .attr("xmlns:image", "http://www.google.com/schemas/sitemap-image/1.1")
    .child(
      element("url")
        .child(element("loc").text(`${baseUrl}/`))
        .child(element("lastmod").text("2025-02-19")) // hardcode ajaa lah
        .child(element("changefreq").text("yearly"))
        .child(element("priority").text("0.8"))
        .child(
          element("image:image")
            .child(element("image:loc").text(`${baseUrl}/assets/logo_umn.png`))
            .child(
              element("image:caption").text(
                "Logo Universitas Multimedia Nusantara"
              )
            ),
          element("image:image")
            .child(
              element("image:loc").text(`${baseUrl}/assets/AcademicProfile.svg`)
            )
            .child(
              element("image:caption").text("What is Computer Engineering?")
            ),
          element("image:image")
            .child(element("image:loc").text(`${baseUrl}/assets/kaprodi.png`))
            .child(element("image:caption").text("Kaprodi Teknik Komputer"))
        ),
      ...data.map((item) =>
        element("url")
          .child(
            element("loc").text(
              `${baseUrl}/${item.Category?.slug}/${item.slug}`
            )
          )
          .child(element("lastmod").text(item.updatedAt.toISOString()))
          .child(element("changefreq").text("monthly"))
          .child(element("priority").text("0.7"))
      )
    );

  return res.type("application/xml").send(renderToString(root));
};
