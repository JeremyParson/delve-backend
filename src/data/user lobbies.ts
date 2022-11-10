import { UserLobbies, Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function index(): Promise<UserLobbies[]> {
  const userLobbies = await prisma.userLobbies.findMany();
  return userLobbies;
}

async function detail(where: Prisma.UserLobbiesWhereInput={}): Promise<UserLobbies> {
  const userLobby = await prisma.userLobbies.findFirst({
    where
  });
  return userLobby;
}

async function create(payload: Prisma.UserLobbiesCreateInput): Promise<UserLobbies> {
  const userLobby = await prisma.userLobbies.create({
    data: payload,
  });
  return userLobby;
}

async function update(index: number, payload: Prisma.UserLobbiesUpdateInput) {
  const userLobby = await prisma.userLobbies.update({
    where: {
      id: index
    },
    data: payload,
  });
  return userLobby;
}

async function remove(index: number) {
  await prisma.userLobbies.delete({
    where: {
      id: index,
    },
  });
}

export default { index, detail, create, update, delete: remove };
