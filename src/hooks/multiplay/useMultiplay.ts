import { useAtomCallback, useAtomValue } from "jotai/utils";
import * as Colyseus from "colyseus.js";
import * as PhraseGen from "korean-random-words";

import {
  ChannelMessage,
  ConnectToChannelParams,
  CustomColyseusClient,
  Move,
  PlayerRoomState,
  UseMultiPlay,
} from "./types";
import {
  multiplayLobbyAtom,
  multiplayMessageAtom,
  multiplayMyPlayerAtom,
  multiplayPlayersAtom,
} from "../../atoms";

const COLYSEUS_BASE_URL = "wss://multiplay.adler3d.com:443";

export const genderType = {
  male: "M",
  female: "F",
} as const;

export const playType = {
  scrollMode: 0,
  multiplayMode: 1,
} as const;

const COLYSEUS_COMMANDS = {
  lobby: "lobby",
  rooms: "rooms",
  plus: "+",
  minus: "-",
  channel: "game",
  move: "move",
  chat: "chat",
} as const;

const colyseusClient = new Colyseus.Client(COLYSEUS_BASE_URL);

const phraseGen = new PhraseGen({
  delimiter: " ",
});

function useMultiplay(): UseMultiPlay {
  const lobby = useAtomValue(multiplayLobbyAtom);
  const players = useAtomValue(multiplayPlayersAtom);
  const messages = useAtomValue(multiplayMessageAtom);
  const myPlayer = useAtomValue(multiplayMyPlayerAtom);

  const onJoinLobby = useAtomCallback((_get, set, lobby: Colyseus.Room) => {
    lobby.onMessage(
      COLYSEUS_COMMANDS.rooms,
      (lobby: CustomColyseusClient[]) => {
        set(multiplayLobbyAtom, {
          isLive: true,
          channels: [...lobby],
        });
      }
    );

    lobby.onMessage(COLYSEUS_COMMANDS.plus, ([roomId, room]) => {
      set(multiplayLobbyAtom, (prevLobbyData) => {
        if (!prevLobbyData.isLive || !prevLobbyData.channels)
          return {
            isLive: false,
            channels: undefined,
          };

        if (
          prevLobbyData.channels.find((channel) => channel.roomId === roomId)
        ) {
          return {
            isLive: prevLobbyData.isLive,
            channels: prevLobbyData.channels.map((activeRoom) => {
              if (activeRoom.roomId === roomId) return room;

              return activeRoom;
            }),
          };
        }

        return {
          isLive: prevLobbyData.isLive,
          channels: [...prevLobbyData.channels, room],
        };
      });
    });

    lobby.onMessage(COLYSEUS_COMMANDS.minus, (roomId) => {
      set(multiplayLobbyAtom, (prevLobbyData) => {
        if (!prevLobbyData.isLive || !prevLobbyData.channels)
          return { isLive: false, channels: undefined };

        return {
          isLive: prevLobbyData.isLive,
          channels: prevLobbyData.channels.filter((room) => room.id !== roomId),
        };
      });
    });

    lobby.onLeave(() => {
      set(multiplayLobbyAtom, { isLive: false, channels: undefined });
    });
  });

  const connectToLobby = async () => {
    await colyseusClient
      .joinOrCreate(COLYSEUS_COMMANDS.lobby)
      .then((lobby) => {
        onJoinLobby(lobby);
      })
      .catch((error) => {
        console.error(`[COLYSEUS] Connect to lobby has failed :: ${error}`);
      });
  };

  const onJoinChannel = useAtomCallback(
    (get, set, channel: Colyseus.Room<PlayerRoomState>) => {
      set(multiplayMyPlayerAtom, channel as CustomColyseusClient);

      channel.state.players.onAdd = (player, sessionId) => {
        player.onChange = () => {
          set(multiplayPlayersAtom, (activePlayers) => {
            if (activePlayers) return { ...activePlayers, [sessionId]: player };

            return { [sessionId]: player };
          });
        };

        set(multiplayPlayersAtom, (activePlayers) => {
          if (activePlayers) return { ...activePlayers, [sessionId]: player };

          return { [sessionId]: player };
        });
      };

      channel.state.players.onRemove = (_player, sessionId) => {
        const myPlayer = get(multiplayMyPlayerAtom);

        if (myPlayer?.roomId === sessionId) {
          set(multiplayPlayersAtom, undefined);
          set(multiplayMessageAtom, undefined);
          set(multiplayMyPlayerAtom, undefined);
        }

        set(multiplayPlayersAtom, (activePlayers) => {
          if (activePlayers) {
            const players = { ...activePlayers };

            delete players[sessionId];

            return players;
          }

          return undefined;
        });
      };

      channel.onMessage<ChannelMessage>(COLYSEUS_COMMANDS.chat, (message) => {
        set(multiplayMessageAtom, (prevMessages) => {
          if (!prevMessages) return [message];

          return [...prevMessages, message];
        });
      });
    }
  );

  const connectToChannel = async ({
    spaceId,
    user,
  }: ConnectToChannelParams) => {
    const UNAUTHENTICATED_USERNAME = "Unauthenticated";
    const temporaryNameArray: string[] = phraseGen.generatePhrase().split(" ");
    const temporaryName: string = temporaryNameArray[1].concat(
      ` ${temporaryNameArray[2]}`
    );

    await colyseusClient
      .joinOrCreate<PlayerRoomState>(COLYSEUS_COMMANDS.channel, {
        spaceId,
        ...user,
        username: user.username ?? UNAUTHENTICATED_USERNAME,
        nickname: user.nickname ?? temporaryName,
        profile: user.profile ?? "",
        playType: playType[user.playType],
        gender: genderType[user.type],
      })
      .then((channel) => {
        onJoinChannel(channel);
      })
      .catch((error) => {
        console.error(`[COLYSEUS] Connect to channel has failed :: ${error}`);
      });
  };

  const playerMove = useAtomCallback((get, _set, move: Move) => {
    const myPlayer = get(multiplayMyPlayerAtom);

    if (myPlayer) {
      myPlayer.send(COLYSEUS_COMMANDS.move, move);
    }
  });

  const playerChat = useAtomCallback((get, _set, message) => {
    const myPlayer = get(multiplayMyPlayerAtom);

    if (myPlayer) {
      myPlayer.send(COLYSEUS_COMMANDS.chat, { message });
    }
  });

  return {
    lobby,
    players,
    messages,
    myPlayer,
    playerMove,
    playerChat,
    connectToLobby,
    connectToChannel,
  };
}

export default useMultiplay;
