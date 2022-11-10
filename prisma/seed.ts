import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function seed() {
  const lobby = await prisma.lobbies.create({
    data: {
      lobby_name: "Test Lobby",
    },
  });

  const game = await prisma.games.create({
    data: {
      game_name: "Test Game",
    },
  });

  const admin = await prisma.users.create({
    data: {
      username: "jparson",
      email: "jsbparson@gmail.com",
      role: "admin",
      password_digest: bcrypt.hashSync("qwerty123", 10),
      gameUsers: {
        create: {
          gameId: game.id,
        },
      },
    },
  });

  const user = await prisma.users.create({
    data: {
      username: "baconsoul123",
      email: "baconsoul123.jp@gmail.com",
      role: "user",
      password_digest: bcrypt.hashSync("qwerty123", 10),
      userLobbies: {
        create: {
          lobbyId: lobby.id,
        },
      },
    },
  });

  const abilitySteal = await prisma.abilities.create({
    data: {
      name: "Steal",
      description:
        "Steal a random item from the target's inventory on a successful dexterity check.",
    },
  });

  const abilityFireBreath = await prisma.abilities.create({
    data: {
      name: "Fire Breath",
      description:
        "Amber clouds of plasma spew from your mouth covering a cone shaped area.",
    },
  });

  const itemHealingPotion = await prisma.items.create({
    data: {
      name: "Minor Healing Potion",
    },
  });

  const character = await prisma.characters.create({
    data: {
      name: "Sir Parsonian",
      health: 100,
      strength: 99,
      userid: admin.id,
      characterAbilities: {
        create: {
          abilityId: abilityFireBreath.id,
        },
      },
      characterItems: {
        create: {
          itemId: itemHealingPotion.id,
        },
      },
    },
  });

  const monster = await prisma.monsters.create({
    data: {
      name: "Goblin",
      monsterAbilities: {
        create: [
          {
            abilityId: abilitySteal.id,
          },
        ],
      },
      gameMonsters: {
        create: {
          gameId: game.id,
        }
      }
    },
  });
}

seed()
  .then(() => {
    console.log("done");
    prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(0);
  });
