import { atom } from "jotai";

import {
  MultiplayLobbyAtom,
  Players,
  ChannelMessage,
  CustomColyseusClient,
} from "./hooks/multiplay/types";

export const multiplayLobbyAtom = atom<MultiplayLobbyAtom>({
  channels: undefined,
  isLive: false,
});

export const multiplayPlayersAtom = atom<Players | undefined>(undefined);

export const multiplayMessageAtom = atom<ChannelMessage[] | undefined>(
  undefined
);

export const multiplayMyPlayerAtom = atom<CustomColyseusClient | undefined>(
  undefined
);
