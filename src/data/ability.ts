import { Abilities, Prisma, PrismaClient } from "@prisma/client";
import prisma from ".";

async function index(): Promise<Abilities[]> {
  const abilities = await prisma.abilities.findMany();
  return abilities;
}

async function detail(where: Prisma.AbilitiesWhereInput={}): Promise<Abilities> {
  const ability = await prisma.abilities.findFirst({
    where
  });
  return ability;
}

async function create(payload: Prisma.AbilitiesCreateInput): Promise<Abilities> {
  const ability = await prisma.abilities.create({
    data: payload,
  });
  return ability;
}

async function update(index: number, payload: Prisma.AbilitiesUpdateInput) {
  const ability = await prisma.abilities.update({
    where: {
      id: index
    },
    data: payload,
  });
  return ability;
}

async function remove(index: number) {
  await prisma.abilities.delete({
    where: {
      id: index,
    },
  });
}

export default { index, detail, create, update, delete: remove };
