import { MonsterAbilities, Prisma, PrismaClient } from "@prisma/client";
import prisma from ".";

async function index(): Promise<MonsterAbilities[]> {
  const monsterAbilities = await prisma.monsterAbilities.findMany();
  return monsterAbilities;
}

async function detail(where: Prisma.MonsterAbilitiesWhereInput): Promise<MonsterAbilities> {
  const monsterAbility = await prisma.monsterAbilities.findFirst({
    where
  });
  return monsterAbility;
}

async function create(payload: Prisma.MonsterAbilitiesCreateInput): Promise<MonsterAbilities> {
  const monsterAbility = await prisma.monsterAbilities.create({
    data: payload,
  });
  return monsterAbility;
}

async function update(index: number, payload: Prisma.MonsterAbilitiesUpdateInput) {
  const monsterAbility = await prisma.monsterAbilities.update({
    where: {
      id: index
    },
    data: payload,
  });
  return monsterAbility;
}

async function remove(index: number) {
  await prisma.monsterAbilities.delete({
    where: {
      id: index,
    },
  });
}

export default { index, detail, create, update, delete: remove };
