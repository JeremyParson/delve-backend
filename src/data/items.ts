import { Items, Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function index(): Promise<Items[]> {
  const items = await prisma.items.findMany();
  return items;
}

async function detail(where: Prisma.ItemsWhereInput={}): Promise<Items> {
  const item = await prisma.items.findFirst({
    where
  });
  return item;
}

async function create(payload: Prisma.ItemsCreateInput): Promise<Items> {
  const item = await prisma.items.create({
    data: payload,
  });
  return item;
}

async function update(index: number, payload: Prisma.ItemsUpdateInput) {
  const item = await prisma.items.update({
    where: {
      id: index
    },
    data: payload,
  });
  return item;
}

async function remove(index: number) {
  await prisma.items.delete({
    where: {
      id: index,
    },
  });
}

export default { index, detail, create, update, delete: remove };
