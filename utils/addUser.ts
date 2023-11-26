import prisma from "@/services/db";
import { hash } from "bcrypt";

const main = async () => {
  const args = process.argv.slice(2);

  const name = args[0];
  const email = args[1];
  const password = args[2];

  if (args.length < 3) {
    throw new Error("usage: yarn run add:user <name> <email> <password>");
  }

  if (!name || !email || !password) {
    throw new Error("username email password tidak boleh kosong");
  }

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: await hash(password, 10),
    },
  });

  const { password: _, ...rest } = user;

  console.log(rest);
};

main()
  .then(() => {
    console.log("Berhasil menambahkan user");
  })
  .catch((err) => {
    console.error(err);
  });
