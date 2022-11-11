import { CharacterItems, Prisma, PrismaClient } from "@prisma/client";
import prisma from ".";

async function index(): Promise<CharacterItems[]> {
  const characterItems = await prisma.characterItems.findMany();
  return characterItems;
}

async function detail(where: Prisma.CharacterItemsWhereInput): Promise<CharacterItems> {
  const characterItem = await prisma.characterItems.findFirst({
    where
  });
  return characterItem;
}

async function create(payload: Prisma.CharacterItemsCreateInput): Promise<CharacterItems> {
  const characterItem = await prisma.characterItems.create({
    data: payload,
  });
  return characterItem;
}

async function update(index: number, payload: Prisma.CharacterItemsUpdateInput) {
  const characterItem = await prisma.characterItems.update({
    where: {
      id: index
    },
    data: payload,
  });
  return characterItem;
}

async function remove(index: number) {
  await prisma.characterItems.delete({
    where: {
      id: index,
    },
  });
}

export default { index, detail, create, update, delete: remove };
