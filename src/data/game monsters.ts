import { GameMonsters, Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function index(): Promise<GameMonsters[]> {
  const gameMonsters = await prisma.gameMonsters.findMany();
  return gameMonsters;
}

async function detail(where: Prisma.GameMonstersWhereInput): Promise<GameMonsters> {
  const gameMonster = await prisma.gameMonsters.findFirst({
    where
  });
  return gameMonster;
}

async function create(payload: Prisma.GameMonstersCreateInput): Promise<GameMonsters> {
  const gameMonster = await prisma.gameMonsters.create({
    data: payload,
  });
  return gameMonster;
}

async function update(index: number, payload: Prisma.GameMonstersUpdateInput) {
  const gameMonster = await prisma.gameMonsters.update({
    where: {
      id: index
    },
    data: payload,
  });
  return gameMonster;
}

async function remove(index: number) {
  await prisma.gameMonsters.delete({
    where: {
      id: index,
    },
  });
}

export default { index, detail, create, update, delete: remove };
