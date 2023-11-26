import { Response, Request } from "express";
import db from "@/services/db";
import {
  internalServerError,
  notFound,
  parseZodError,
  success,
  validationError,
} from "@/utils/responses";
import {
  CreateItemDto,
  ReorderDto,
  createItemDto,
  reorderDto,
} from "@/models/item.model";

export const getContentBySlug = async (
  req: Request<{
    slugCategory: string;
    slugItem: string;
  }>,
  res: Response
) => {
  try {
    const { slugCategory, slugItem } = req.params;

    const category = await db.category.findUnique({
      where: { slug: slugCategory },
      select: {
        items: {
          where: { slug: slugItem },
          take: 1,
        },
      },
    });

    if (!category) {
      return notFound(res, "Kategori tidak ditemukan");
    }

    if (!category.items.length) {
      return notFound(res, "Konten tidak ditemukan");
    }

    const currContent = category.items[0];

    if (currContent.type === "DYNAMIC") {
      if (!currContent.dynamicId) {
        return notFound(res, "Konten Dynamic belum diisi");
      }

      const dynamic = await db.dynamicPage.findUnique({
        where: { id: currContent.dynamicId },
        include: {
          author: {
            select: {
              name: true,
            },
          },
        },
      });

      if (!dynamic) {
        return notFound(res, "Konten tidak ditemukan");
      }

      return success(res, "Berhasil mendapatkan konten", dynamic);
    }

    if (currContent.type === "PROFILE") {
      if (!currContent.profileId) {
        return notFound(res, "Konten Profile belum diisi");
      }

      const profile = await db.profilePage.findUnique({
        where: { id: currContent.profileId },
        include: {
          author: {
            select: {
              name: true,
            },
          },
          profile: true,
        },
      });

      if (!profile) {
        return notFound(res, "Konten tidak ditemukan");
      }

      return success(res, "Berhasil mendapatkan konten", profile);
    }

    if (!currContent.linkId) {
      return notFound(res, "Konten Link belum diisi");
    }

    const link = await db.link.findUnique({
      where: { id: currContent.linkId! },
      include: {
        author: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!link) {
      return notFound(res, "Konten tidak ditemukan");
    }

    return success(res, "Berhasil mendapatkan konten", link);
  } catch (err) {
    console.error(err);
    return internalServerError(res);
  }
};

export const createItem = async (
  req: Request<
    {
      slugCategory: string;
    },
    {},
    CreateItemDto
  >,
  res: Response
) => {
  try {
    const { slugCategory } = req.params;
    const validate = await createItemDto.safeParseAsync(req.body);

    if (!validate.success) {
      return validationError(res, parseZodError(validate.error));
    }

    const { slug, type } = validate.data;

    const category = await db.category.findUnique({
      where: { slug: slugCategory },
      include: {
        items: {
          select: {
            order: true,
            slug: true,
          },
          orderBy: {
            order: "desc",
          },
          take: 1,
        },
      },
    });

    if (!category) {
      return notFound(res, "Kategori tidak ditemukan");
    }

    // check if slug on items is unique
    const slugExists = category.items.some((item) => item.slug === slug);
    if (slugExists) {
      return validationError(res, "Slug sudah digunakan");
    }

    const order = category.items.length ? category.items[0].order + 1 : 1;

    const item = await db.item.create({
      data: {
        slug,
        type,
        order,
        Category: {
          connect: {
            slug: slugCategory,
          },
        },
      },
    });

    return success(res, "Berhasil membuat item konten", item);
  } catch (err) {
    console.error(err);
    return internalServerError(res);
  }
};

export const updateItem = async (
  req: Request<
    {
      slugCategory: string;
      slugItem: string;
    },
    {},
    Partial<CreateItemDto>
  >,
  res: Response
) => {
  try {
    const { slugCategory, slugItem } = req.params;
    const validate = await createItemDto.partial().safeParseAsync(req.body);

    if (!validate.success) {
      return validationError(res, parseZodError(validate.error));
    }

    const { slug, type } = validate.data;

    const category = await db.category.findUnique({
      where: { slug: slugCategory },
      include: {
        items: {
          where: { slug: slugItem },
          take: 1,
        },
      },
    });

    if (!category) {
      return notFound(res, "Kategori tidak ditemukan");
    }

    if (!category.items.length) {
      return notFound(res, "Konten tidak ditemukan");
    }

    const currContent = category.items[0];

    // delete existing children based on type
    if (currContent.type === "DYNAMIC" && currContent.dynamicId) {
      await db.dynamicPage.delete({
        where: { id: currContent.dynamicId },
      });
    }

    if (currContent.type === "PROFILE" && currContent.profileId) {
      await db.profile.deleteMany({
        where: { profilePageId: currContent.profileId },
      });

      await db.profilePage.delete({
        where: { id: currContent.profileId },
      });
    }

    if (currContent.type === "LINK" && currContent.linkId) {
      await db.link.delete({
        where: { id: currContent.linkId },
      });
    }

    const item = await db.item.update({
      where: { id: currContent.id },
      data: {
        slug,
        type,
      },
    });

    return success(res, "Berhasil mengubah konten", item);
  } catch (err) {
    console.error(err);
    return internalServerError(res);
  }
};

export const deleteItem = async (
  req: Request<{
    slugCategory: string;
    slugItem: string;
  }>,
  res: Response
) => {
  try {
    const { slugCategory, slugItem } = req.params;

    const category = await db.category.findUnique({
      where: { slug: slugCategory },
      include: {
        items: {
          where: { slug: slugItem },
          take: 1,
        },
      },
    });

    if (!category) {
      return notFound(res, "Kategori tidak ditemukan");
    }

    if (!category.items.length) {
      return notFound(res, "Konten tidak ditemukan");
    }

    const currContent = category.items[0];

    if (currContent.type === "PROFILE" && currContent.profileId) {
      await db.profile.deleteMany({
        where: { profilePageId: currContent.profileId },
      });
    }

    await db.item.delete({
      where: { id: currContent.id },
    });

    return success(res, "Berhasil menghapus konten");
  } catch (err) {
    console.error(err);
    return internalServerError(res);
  }
};

export const reorderItems = async (
  req: Request<
    {
      slugCategory: string;
    },
    {},
    ReorderDto
  >,
  res: Response
) => {
  try {
    const { slugCategory } = req.params;

    const validate = await reorderDto.safeParseAsync(req.body);

    if (!validate.success) {
      return validationError(res, parseZodError(validate.error));
    }

    const { order } = validate.data;

    // check if order is valid
    const items = await db.item.findMany({
      where: { Category: { slug: slugCategory } },
      select: {
        slug: true,
      },
    });

    if (!items.length) {
      return notFound(res, "Kategori tidak ditemukan");
    }

    const orderIsValid = order.every((slug) =>
      items.some((item) => item.slug === slug)
    );

    if (!orderIsValid) {
      return validationError(res, "Entry slug tidak valid");
    }

    // update order using transaction
    await db.$transaction(
      order.map((slug, index) =>
        db.item.update({
          where: { slug },
          data: { order: index + 1 },
        })
      )
    );

    return success(res, "Berhasil mengubah urutan konten");
  } catch (err) {
    console.error(err);
    return internalServerError(res);
  }
};
