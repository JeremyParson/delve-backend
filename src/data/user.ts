import { Users, Prisma, PrismaClient } from "@prisma/client";
import prisma from ".";

async function index(): Promise<Users[]> {
  const users = await prisma.users.findMany();
  return users;
}

async function detail(where: Prisma.UsersWhereInput={}): Promise<Users> {
  const user = await prisma.users.findFirst({
    where
  });
  return user;
}

async function create(payload: Prisma.UsersCreateInput): Promise<Users> {
  const user = await prisma.users.create({
    data: payload,
  });
  return user;
}

async function update(index: number, payload: Prisma.UsersUpdateInput) {
  const user = await prisma.users.update({
    where: {
      id: index
    },
    data: payload,
  });
  return user;
}

async function remove(index: number) {
  await prisma.users.delete({
    where: {
      id: index,
    },
  });
}

export default { index, detail, create, update, delete: remove };
