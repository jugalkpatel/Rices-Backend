import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // prisma queries

  await prisma.user.create({
    data: {
      email: "foo@gmail.com",
      name: "foo",
      password: "foofoofoo1234",
    },
  });

  const allUsers = await prisma.user.findMany();

  console.dir(allUsers, { depth: null });
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
