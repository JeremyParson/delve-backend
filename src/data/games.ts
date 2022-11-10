import { Games, Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function index(): Promise<Games[]> {
  const games = await prisma.games.findMany();
  return games;
}

async function detail(where: Prisma.GamesWhereInput={}): Promise<Games> {
  const game = await prisma.games.findFirst({
    where
  });
  return game;
}

async function create(payload: Prisma.GamesCreateInput): Promise<Games> {
  const game = await prisma.games.create({
    data: payload,
  });
  return game;
}

async function update(index: number, payload: Prisma.GamesUpdateInput) {
  const game = await prisma.games.update({
    where: {
      id: index
    },
    data: payload,
  });
  return game;
}

async function remove(index: number) {
  await prisma.games.delete({
    where: {
      id: index,
    },
  });
}

export default { index, detail, create, update, delete: remove };
