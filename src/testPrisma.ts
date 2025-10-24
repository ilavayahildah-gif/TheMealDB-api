import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function test() {
  const fields = await prisma.user.findFirst({
    select: { id: true, first_name: true, last_name: true },
  });
  console.log(fields);
}

test();
