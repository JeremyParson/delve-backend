import { CharacterAbilities, Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function index(): Promise<CharacterAbilities[]> {
  const abilities = await prisma.characterAbilities.findMany();
  return abilities;
}

async function detail(where: Prisma.CharacterAbilitiesWhereInput): Promise<CharacterAbilities> {
  const ability = await prisma.characterAbilities.findFirst({
    where
  });
  return ability;
}

async function create(payload: Prisma.CharacterAbilitiesCreateInput): Promise<CharacterAbilities> {
  const ability = await prisma.characterAbilities.create({
    data: payload,
  });
  return ability;
}

async function update(index: number, payload: Prisma.CharacterAbilitiesUpdateInput) {
  const ability = await prisma.characterAbilities.update({
    where: {
      id: index
    },
    data: payload,
  });
  return ability;
}

async function remove(index: number) {
  await prisma.characterAbilities.delete({
    where: {
      id: index,
    },
  });
}

export default { index, detail, create, update, delete: remove };
