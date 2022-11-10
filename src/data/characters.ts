import { Characters, Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function index(): Promise<Characters[]> {
  const characters = await prisma.characters.findMany();
  return characters;
}

async function detail(where: Prisma.CharactersWhereInput={}): Promise<Characters> {
  const character = await prisma.characters.findFirst({
    where
  });
  return character;
}

async function create(payload: Prisma.CharactersCreateInput): Promise<Characters> {
  const character = await prisma.characters.create({
    data: payload,
  });
  return character;
}

async function update(index: number, payload: Prisma.CharactersUpdateInput) {
  const character = await prisma.characters.update({
    where: {
      id: index
    },
    data: payload,
  });
  return character;
}

async function remove(index: number) {
  await prisma.characters.delete({
    where: {
      id: index,
    },
  });
}

export default { index, detail, create, update, delete: remove };
