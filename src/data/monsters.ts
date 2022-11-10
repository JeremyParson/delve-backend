import { Monsters, Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function index(): Promise<Monsters[]> {
  const monsters = await prisma.monsters.findMany();
  return monsters;
}

async function detail(where: Prisma.MonstersWhereInput={}): Promise<Monsters> {
  const monster = await prisma.monsters.findFirst({
    where
  });
  return monster;
}

async function create(payload: Prisma.MonstersCreateInput): Promise<Monsters> {
  const monster = await prisma.monsters.create({
    data: payload,
  });
  return monster;
}

async function update(index: number, payload: Prisma.MonstersUpdateInput) {
  const monster = await prisma.monsters.update({
    where: {
      id: index
    },
    data: payload,
  });
  return monster;
}

async function remove(index: number) {
  await prisma.monsters.delete({
    where: {
      id: index,
    },
  });
}

export default { index, detail, create, update, delete: remove };
