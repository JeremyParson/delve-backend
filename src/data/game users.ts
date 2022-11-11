import { GameUsers, Prisma, PrismaClient } from "@prisma/client";
import prisma from ".";

async function index(): Promise<GameUsers[]> {
  const gameUsers = await prisma.gameUsers.findMany();
  return gameUsers;
}

async function detail(where: Prisma.GameUsersWhereInput): Promise<GameUsers> {
  const gameUser = await prisma.gameUsers.findFirst({
    where
  });
  return gameUser;
}

async function create(payload: Prisma.GameUsersCreateInput): Promise<GameUsers> {
  const gameUser = await prisma.gameUsers.create({
    data: payload,
  });
  return gameUser;
}

async function update(index: number, payload: Prisma.GameUsersUpdateInput) {
  const gameUser = await prisma.gameUsers.update({
    where: {
      id: index
    },
    data: payload,
  });
  return gameUser;
}

async function remove(index: number) {
  await prisma.gameUsers.delete({
    where: {
      id: index,
    },
  });
}

export default { index, detail, create, update, delete: remove };
