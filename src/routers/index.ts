import { Router } from "express";
import AbilityRouter from "./abilities";
import CharacterAbilityRouter from "./character abilities";
import CharacterItemRouter from "./character items";
import CharactersRouter from "./characters";
import GameMonsterRouter from "./game monsters";
import GameUserRouter from "./game users";
import GameRouter from "./games";
import ItemRouter from "./items";
import LobbyRouter from "./lobbies";
import MonsterAbilityRouter from "./monster abilities";
import MonsterRouter from "./monsters";
import UserLobbyRouter from "./user lobbies";
import UserRouter from "./user";
import AuthenticationRouter from "./authentication";


const router = Router();
router.use('/abilities', AbilityRouter);
router.use('/character-abilities', CharacterAbilityRouter);
router.use('/character-items', CharacterItemRouter);
router.use('/characters', CharactersRouter);
router.use('/game-monsters', GameMonsterRouter);
router.use('/game-users', GameUserRouter);
router.use('/games', GameRouter);
router.use('/items', ItemRouter);
router.use('/lobbies', LobbyRouter);
router.use('/monster-abilities', MonsterAbilityRouter);
router.use('/monsters', MonsterRouter);
router.use('/user-lobbies', UserLobbyRouter);
router.use('/users', UserRouter);
router.use('/authentication', AuthenticationRouter);



export default router;
