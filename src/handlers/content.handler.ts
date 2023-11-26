import { Response, Request } from "express";
import db from "@/services/db";
import {
  notFound,
  parseZodError,
  success,
  validationError,
} from "@/utils/responses";

import {
  type DynamicPageDto,
  dynamicPageDto,
} from "@/models/items/dynamic.page.model";
import {
  type ProfileDto,
  type ProfilePageDto,
  profileDto,
  profilePageDto,
} from "@/models/items/profile.page.model";
import { LinkDto, linkDto } from "@/models/items/link.model";

export const createOrUpdateDynamicPage = async (
  req: Request<
    {
      slugCategory: string;
      slugItem: string;
    },
    {},
    DynamicPageDto
  >,
  res: Response
) => {
  const { slugCategory, slugItem } = req.params;

  const validate = await dynamicPageDto.safeParseAsync(req.body);

  if (!validate.success) {
    return validationError(res, parseZodError(validate.error));
  }

  const { title, content } = validate.data;

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

  if (currContent.type !== "DYNAMIC") {
    return validationError(res, "Konten bukan tipe Dynamic");
  }

  if (currContent.dynamicId) {
    await db.dynamicPage.update({
      where: { id: currContent.dynamicId },
      data: {
        title,
        content,
      },
    });

    return success(res, "Berhasil mengubah konten");
  }
  await db.dynamicPage.create({
    data: {
      title,
      content,
      author: {
        connect: {
          id: req.user?.id,
        },
      },
      Item: {
        connect: {
          id: currContent.id,
        },
      },
    },
  });

  return success(res, "Berhasil membuat konten");
};

// create or update profile page

export const createOrUpdateProfilePage = async (
  req: Request<
    {
      slugCategory: string;
      slugItem: string;
    },
    {},
    ProfilePageDto
  >,
  res: Response
) => {
  const { slugCategory, slugItem } = req.params;

  const validate = await profilePageDto.safeParseAsync(req.body);

  if (!validate.success) {
    return validationError(res, parseZodError(validate.error));
  }

  const { title, description } = validate.data;

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

  if (currContent.type !== "PROFILE") {
    return validationError(res, "Konten bukan tipe Profile");
  }

  if (currContent.profileId) {
    await db.profilePage.update({
      where: { id: currContent.profileId },
      data: {
        title,
        description,
      },
    });

    return success(res, "Berhasil mengubah konten profile");
  }

  await db.profilePage.create({
    data: {
      title,
      description,
      author: {
        connect: {
          id: req.user?.id,
        },
      },
      Item: {
        connect: {
          id: currContent.id,
        },
      },
    },
  });

  return success(res, "Berhasil membuat konten profile");
};

// insert profile to profile page

export const addProfileToProfilePage = async (
  req: Request<
    {
      slugCategory: string;
      slugItem: string;
    },
    {},
    ProfileDto
  >,
  res: Response
) => {
  const { slugCategory, slugItem } = req.params;

  const validate = await profileDto.safeParseAsync(req.body);

  if (!validate.success) {
    return validationError(res, parseZodError(validate.error));
  }

  const {
    name,
    email,
    picUrl,
    position,
    expertise,
    staffHandbookLink,
    profileUrl,
  } = validate.data;

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

  if (currContent.type !== "PROFILE") {
    return validationError(res, "Konten bukan tipe Profile");
  }

  if (!currContent.profileId) {
    return validationError(res, "Konten Profile belum dibuat");
  }

  const profile = await db.profile.create({
    data: {
      name,
      email,
      picUrl,
      position,
      expertise,
      staffHandbookLink,
      profileUrl,
      ProfilePage: {
        connect: {
          id: currContent.profileId,
        },
      },
    },
  });

  return success(res, "Berhasil menambahkan profile", profile);
};

// delete profile from profile page

export const updateProfileFromProfilePage = async (
  req: Request<
    {
      slugCategory: string;
      slugItem: string;
      idProfile: string;
    },
    {},
    Partial<ProfileDto>
  >,
  res: Response
) => {
  const { slugCategory, slugItem, idProfile } = req.params;

  const validate = await profileDto.partial().safeParseAsync(req.body);

  if (!validate.success) {
    return validationError(res, parseZodError(validate.error));
  }

  const category = await db.category.findUnique({
    where: { slug: slugCategory },
    include: {
      items: {
        where: { slug: slugItem },
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

  if (currContent.type !== "PROFILE") {
    return validationError(res, "Konten bukan tipe Profile");
  }

  const profile = await db.profile.findUnique({
    where: { id: idProfile },
  });

  if (!profile) {
    return notFound(res, "Profile tidak ditemukan");
  }

  await db.profile.update({
    where: { id: profile.id },
    data: validate.data,
  });

  return success(res, "Berhasil mengubah profile");
};

export const deleteProfileFromProfilePage = async (
  req: Request<{
    slugCategory: string;
    slugItem: string;
    idProfile: string;
  }>,
  res: Response
) => {
  const { slugCategory, slugItem, idProfile } = req.params;

  const category = await db.category.findUnique({
    where: { slug: slugCategory },
    include: {
      items: {
        where: { slug: slugItem },
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

  if (currContent.type !== "PROFILE") {
    return validationError(res, "Konten bukan tipe Profile");
  }

  const profile = await db.profile.findUnique({
    where: { id: idProfile },
  });

  if (!profile) {
    return notFound(res, "Profile tidak ditemukan");
  }

  await db.profile.delete({
    where: { id: profile.id },
  });

  return success(res, "Berhasil menghapus profile");
};

// create or update link

export const createOrUpdateLink = async (
  req: Request<
    {
      slugCategory: string;
      slugItem: string;
    },
    {},
    LinkDto
  >,
  res: Response
) => {
  const { slugCategory, slugItem } = req.params;

  const validate = await linkDto.safeParseAsync(req.body);

  if (!validate.success) {
    return validationError(res, parseZodError(validate.error));
  }

  const { title, url } = validate.data;

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

  if (currContent.type !== "LINK") {
    return validationError(res, "Konten bukan tipe Link");
  }

  if (currContent.linkId) {
    await db.link.update({
      where: { id: currContent.linkId },
      data: {
        title,
        url,
      },
    });

    return success(res, "Berhasil mengubah konten link");
  }

  await db.link.create({
    data: {
      title,
      url,
      author: {
        connect: {
          id: req.user?.id,
        },
      },
      Item: {
        connect: {
          id: currContent.id,
        },
      },
    },
  });

  return success(res, "Berhasil membuat konten link");
};
