import * as Colyseus from "colyseus.js";
import { genderType, playType } from "./useMultiplay";

type GenderType = keyof typeof genderType;

type PlayType = keyof typeof playType;

export interface UserCustomOptions {
  type: GenderType;
  hair: number;
  face: number;
  top: number;
  bottom: number;
  shoes: number;
}

export type User = {
  nickname?: string;
  username?: string;
  profile?: string;
  playType: PlayType;
} & UserCustomOptions;

export type Player = {
  ani: number;
  posx: number;
  posy: number;
  posz: number;
  rotx: number;
  roty: number;
  rotz: number;
  onChange: () => void;
} & User;

export type Players = Record<string, Player>;

export type PlayerState = {
  players: Players;
  onAdd: (player: Player, sessionId: string) => void;
  onRemove: (player: Player, sessionId: string) => void;
};

export interface PlayerRoomState {
  players: PlayerState;
}

export type CustomColyseusClient = Colyseus.RoomAvailable & Colyseus.Room;

export interface ConnectToChannelParams {
  spaceId: string;
  user: User;
}

export interface MultiplayLobbyAtom {
  channels: CustomColyseusClient[] | undefined;
  isLive: boolean;
}

export interface ChannelMessage {
  m: string;
  u: string;
  n: string;
  p: string;
  t: Date;
}

export interface Move {
  pos: {
    x: number;
    y: number;
    z: number;
  };
  rot: {
    x: number;
    y: number;
    z: number;
  };
  ani: number;
}

export interface UseMultiPlay {
  lobby: { channels: CustomColyseusClient[] | undefined; isLive: boolean };
  players: Players | undefined;
  messages: ChannelMessage[] | undefined;
  myPlayer: CustomColyseusClient | undefined;
  playerMove: (move: Move) => void;
  playerChat: (message: string) => void;
  connectToLobby: () => Promise<void>;
  connectToChannel: (
    connectToChannelParams: ConnectToChannelParams
  ) => Promise<void>;
}
