import { Lobbies, Prisma, PrismaClient } from "@prisma/client";
import prisma from ".";

async function index(where: Prisma.LobbiesWhereInput = {}): Promise<Lobbies[]> {
  const lobbies = await prisma.lobbies.findMany({ where });
  return lobbies;
}

async function detail(where: Prisma.LobbiesWhereInput = {}): Promise<Lobbies> {
  const lobby = await prisma.lobbies.findFirst({
    where,
  });
  return lobby;
}

async function create(payload: Prisma.LobbiesCreateInput): Promise<Lobbies> {
  const lobby = await prisma.lobbies.create({
    data: payload,
  });
  return lobby;
}

async function update(index: number, payload: Prisma.LobbiesUpdateInput) {
  const lobby = await prisma.lobbies.update({
    where: {
      id: index,
    },
    data: payload,
  });
  return lobby;
}

async function remove(index: number) {
  await prisma.lobbies.delete({
    where: {
      id: index,
    },
  });
}

export default { index, detail, create, update, delete: remove };
