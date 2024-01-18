import { Response, Request } from "express";
import db from "@/services/db";
import {
  success,
  created,
  validationError,
  parseZodError,
  conflict,
  notFound,
  internalServerError,
} from "@/utils/responses";
import {
  type CategoryCreateDto,
  categoryCreateDto,
  ReorderDto,
  reorderDto,
} from "@/models/category.model";

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await db.category.findMany({
      select: {
        id: true,
        slug: true,
        order: true,
        name: true,
        items: {
          select: {
            id: true,
            slug: true,
            title: true,
            order: true,
            type: true,
            dynamic: {
              select: {
                id: true,
              },
            },
            profile: {
              select: {
                id: true,
              },
            },
            link: {
              select: {
                id: true,
                url: true,
              },
            },
            updatedAt: true,
            createdAt: true,
          },
          orderBy: {
            order: "asc",
          },
        },
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        order: "asc",
      },
    });

    const data = categories.map((category) => ({
      ...category,
      items: category.items.map((item) => ({
        id: item.id,
        title: item.title,
        slug: item.slug,
        order: item.order,
        type: item.type,
        item:
          item.type === "DYNAMIC"
            ? item.dynamic
            : item.type === "PROFILE"
            ? item.profile
            : item.link,
      })),
    }));

    return success(res, "Berhasil mendapatkan semua kategori", data);
  } catch (error) {
    console.error(error);
    return internalServerError(res);
  }
};

export const getCategory = async (req: Request, res: Response) => {
  try {
    const { slugCategory } = req.params;
    const category = await db.category.findUnique({
      where: { slug: slugCategory },
      select: {
        id: true,
        slug: true,
        order: true,
        name: true,
        items: {
          select: {
            id: true,
            slug: true,
            title: true,
            order: true,
            type: true,
            dynamic: {
              select: {
                id: true,
              },
            },
            profile: {
              select: {
                id: true,
              },
            },
            link: {
              select: {
                id: true,
                url: true,
              },
            },
            updatedAt: true,
            createdAt: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!category) {
      return notFound(res, "Category tidak ditemukan");
    }

    const data = {
      ...category,
      items: category.items.map((item) => ({
        id: item.id,
        title: item.title,
        type: item.type,
        slug: item.slug,
        order: item.order,
        item:
          item.type === "DYNAMIC"
            ? item.dynamic
            : item.type === "PROFILE"
            ? item.profile
            : item.link,
      })),
    };

    return success(res, "Berhasil mendapatkan kategori", data);
  } catch (error) {
    console.error(error);
    return internalServerError(res);
  }
};

export const createCategory = async (
  req: Request<{}, {}, CategoryCreateDto>,
  res: Response
) => {
  try {
    const validate = await categoryCreateDto.safeParseAsync(req.body);
    if (!validate.success) {
      return validationError(res, parseZodError(validate.error));
    }

    const { name, slug } = validate.data;

    // check if slug is unique
    const categoryExists = await db.category.findUnique({
      where: { slug },
    });

    if (categoryExists) {
      return conflict(res, "Slug sudah digunakan");
    }

    // find highest order
    const highestOrder = await db.category.findFirst({
      orderBy: {
        order: "desc",
      },
      select: {
        order: true,
      },
    });

    const category = await db.category.create({
      data: {
        name,
        slug,
        order: highestOrder?.order ? highestOrder.order + 1 : 1,
      },
    });

    return created(res, "Berhasil membuat kategori", category);
  } catch (error) {
    console.error(error);
    return internalServerError(res);
  }
};

export const updateCategory = async (
  req: Request<
    { slugCategory: string },
    {},
    Partial<Omit<CategoryCreateDto, "slug">>
  >,
  res: Response
) => {
  try {
    const { slugCategory } = req.params;
    const validate = await categoryCreateDto.partial().safeParseAsync(req.body);
    if (!validate.success) {
      return validationError(res, parseZodError(validate.error));
    }

    const { name, slug } = validate.data;

    // check if category not exists
    const categoryIsExist = await db.category.findUnique({
      where: { slug: slugCategory },
    });

    if (!categoryIsExist) {
      return notFound(res, "Category tidak ditemukan");
    }

    const category = await db.category.update({
      where: { slug: slugCategory },
      data: {
        name,
        slug,
      },
    });

    return success(res, "Berhasil mengubah kategori", category);
  } catch (error) {
    console.error(error);
    return internalServerError(res);
  }
};

export const deleteCategory = async (
  req: Request<{ slugCategory: string }>,
  res: Response
) => {
  try {
    const { slugCategory } = req.params;
    // check if category has items
    const category = await db.category.findUnique({
      where: { slug: slugCategory },
      select: {
        items: true,
      },
    });

    if (!category) {
      return notFound(res, "Category tidak ditemukan");
    }

    if (category?.items.length) {
      return conflict(
        res,
        "Kategori ini memiliki item, hapus item terlebih dahulu"
      );
    }

    await db.category.delete({
      where: { slug: slugCategory },
    });

    return success(res, "Berhasil menghapus kategori");
  } catch (error) {
    console.error(error);
    return internalServerError(res);
  }
};

export const reorderCategories = async (
  req: Request<{}, {}, ReorderDto>,
  res: Response
) => {
  try {
    const validate = await reorderDto.safeParseAsync(req.body);
    if (!validate.success) {
      return validationError(res, parseZodError(validate.error));
    }

    const { order } = validate.data;

    // check if order is valid
    const categories = await db.category.findMany({
      select: {
        slug: true,
      },
    });

    const orderIsValid = order.every((slug) =>
      categories.some((category) => category.slug === slug)
    );

    if (!orderIsValid) {
      return validationError(res, "Entry slug tidak valid");
    }

    // update order
    const categoriesWithOrder = order.map((slug, index) => ({
      slug,
      order: index + 1,
    }));

    await db.$transaction(
      categoriesWithOrder.map((category) =>
        db.category.update({
          where: { slug: category.slug },
          data: {
            order: category.order,
          },
        })
      )
    );

    return success(res, "Berhasil mengubah urutan kategori");
  } catch (error) {
    console.error(error);
    return internalServerError(res);
  }
};
