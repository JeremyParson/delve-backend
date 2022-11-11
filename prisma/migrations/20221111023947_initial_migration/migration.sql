-- CreateTable
CREATE TABLE "Abilities" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255),
    "i_icon" VARCHAR(255),
    "description" VARCHAR(255),
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "cooldown" INTEGER,

    CONSTRAINT "Abilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CharacterAbilities" (
    "id" SERIAL NOT NULL,
    "abilityId" INTEGER,
    "characterid" INTEGER,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "cooldown" INTEGER,

    CONSTRAINT "CharacterAbilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CharacterItems" (
    "id" SERIAL NOT NULL,
    "itemId" INTEGER,
    "characterId" INTEGER,
    "slot" INTEGER,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CharacterItems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Characters" (
    "id" SERIAL NOT NULL,
    "item_left" INTEGER,
    "item_right" INTEGER,
    "item_head" INTEGER,
    "item_body" INTEGER,
    "item_feet" INTEGER,
    "name" VARCHAR(255),
    "i_token" VARCHAR(255),
    "health" INTEGER,
    "mana" INTEGER,
    "level" INTEGER,
    "experience" INTEGER,
    "position_x" INTEGER,
    "position_y" INTEGER,
    "strength" INTEGER,
    "agility" INTEGER,
    "arcana" INTEGER,
    "grit" INTEGER,
    "userid" INTEGER,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Characters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameMonsters" (
    "id" SERIAL NOT NULL,
    "monsterId" INTEGER,
    "gameId" INTEGER,
    "health" INTEGER,
    "mana" INTEGER,
    "position_x" INTEGER,
    "position_y" INTEGER,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GameMonsters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameUsers" (
    "id" SERIAL NOT NULL,
    "gameId" INTEGER,
    "userId" INTEGER,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GameUsers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Games" (
    "id" SERIAL NOT NULL,
    "game_name" VARCHAR(255),
    "layer" VARCHAR(255),
    "difficulty" INTEGER,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Games_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Items" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255),
    "i_icon" VARCHAR(255),
    "description" VARCHAR(255),
    "components" VARCHAR(255),
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lobbies" (
    "id" SERIAL NOT NULL,
    "game" INTEGER,
    "lobby_name" VARCHAR(255),
    "is_public" BOOLEAN,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Lobbies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MonsterAbilities" (
    "id" SERIAL NOT NULL,
    "abilityId" INTEGER,
    "monsterId" INTEGER,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MonsterAbilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Monsters" (
    "id" SERIAL NOT NULL,
    "item_left" INTEGER,
    "item_right" INTEGER,
    "item_head" INTEGER,
    "item_body" INTEGER,
    "item_feet" INTEGER,
    "name" VARCHAR(255),
    "i_token" VARCHAR(255),
    "health" INTEGER,
    "mana" INTEGER,
    "level" INTEGER,
    "experience" INTEGER,
    "strength" INTEGER,
    "agility" INTEGER,
    "arcana" INTEGER,
    "grit" INTEGER,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Monsters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SequelizeMeta" (
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "SequelizeMeta_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "UserLobbies" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "lobbyId" INTEGER,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserLobbies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(255),
    "email" VARCHAR(255),
    "password_digest" VARCHAR(255),
    "role" VARCHAR(255),
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CharacterAbilities" ADD CONSTRAINT "CharacterAbilities_abilityId_fkey" FOREIGN KEY ("abilityId") REFERENCES "Abilities"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "CharacterAbilities" ADD CONSTRAINT "CharacterAbilities_characterId_fkey" FOREIGN KEY ("characterid") REFERENCES "Characters"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "CharacterItems" ADD CONSTRAINT "CharacterItems_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Characters"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "CharacterItems" ADD CONSTRAINT "CharacterItems_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Items"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Characters" ADD CONSTRAINT "Characters_item_body_fkey" FOREIGN KEY ("item_body") REFERENCES "Items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Characters" ADD CONSTRAINT "Characters_item_feet_fkey" FOREIGN KEY ("item_feet") REFERENCES "Items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Characters" ADD CONSTRAINT "Characters_item_head_fkey" FOREIGN KEY ("item_head") REFERENCES "Items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Characters" ADD CONSTRAINT "Characters_item_left_fkey" FOREIGN KEY ("item_left") REFERENCES "Items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Characters" ADD CONSTRAINT "Characters_item_right_fkey" FOREIGN KEY ("item_right") REFERENCES "Items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Characters" ADD CONSTRAINT "Characters_userid_fkey" FOREIGN KEY ("userid") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameMonsters" ADD CONSTRAINT "CharacterItems_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Games"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "GameMonsters" ADD CONSTRAINT "CharacterItems_monsterId_fkey" FOREIGN KEY ("monsterId") REFERENCES "Monsters"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "GameUsers" ADD CONSTRAINT "GameUsers_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Games"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameUsers" ADD CONSTRAINT "GameUsers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lobbies" ADD CONSTRAINT "Lobbies_game_fkey" FOREIGN KEY ("game") REFERENCES "Games"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "MonsterAbilities" ADD CONSTRAINT "MonsterAbilities_abilityId_fkey" FOREIGN KEY ("abilityId") REFERENCES "Abilities"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "MonsterAbilities" ADD CONSTRAINT "MonsterAbilities_monsterId_fkey" FOREIGN KEY ("monsterId") REFERENCES "Monsters"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Monsters" ADD CONSTRAINT "Monsters_item_body_fkey" FOREIGN KEY ("item_body") REFERENCES "Items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Monsters" ADD CONSTRAINT "Monsters_item_feet_fkey" FOREIGN KEY ("item_feet") REFERENCES "Items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Monsters" ADD CONSTRAINT "Monsters_item_head_fkey" FOREIGN KEY ("item_head") REFERENCES "Items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Monsters" ADD CONSTRAINT "Monsters_item_left_fkey" FOREIGN KEY ("item_left") REFERENCES "Items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Monsters" ADD CONSTRAINT "Monsters_item_right_fkey" FOREIGN KEY ("item_right") REFERENCES "Items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "UserLobbies" ADD CONSTRAINT "UserLobbies_lobbyId_fkey" FOREIGN KEY ("lobbyId") REFERENCES "Lobbies"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "UserLobbies" ADD CONSTRAINT "UserLobbies_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
