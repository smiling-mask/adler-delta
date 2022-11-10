import { useEffect, useMemo } from 'react';
import { useAtomValue } from 'jotai';

import { HomeContainer } from './styles';

import useMultiplay from '../../hooks/multiplay/useMultiplay';
import { UserCustomOptions } from '../../hooks/multiplay/types';
import { canvasInitialize, othersAnimate } from '../../3js/mesh';
import { multiplayLobbyAtom, multiplayMyPlayerAtom, multiplayPlayersAtom } from '../../atoms';

import { useSpacesInfiniteQuery } from '../../hooks/react-query/infinite-query';

const customOptions: UserCustomOptions = {
  type: 'female',
  hair: 1,
  face: 1,
  top: 1,
  bottom: 1,
  shoes: 1,
};

const SPACE_ID = 'abcde';

function Home(): JSX.Element {
  const lobby = useAtomValue(multiplayLobbyAtom);
  const myPlayer = useAtomValue(multiplayMyPlayerAtom);
  const players = useAtomValue(multiplayPlayersAtom);
  const { connectToLobby, connectToChannel } = useMultiplay();

  const { spaces } = useSpacesInfiniteQuery({
    userToken: 'f639d45654d303c806d43f713370e030a9ea49e6',
  });

  const isMultiplayReady = useMemo(
    () => lobby.isLive && !!players && !!myPlayer,
    [lobby, players, myPlayer]
  );

  const lobbyClientCount = useMemo(
    () => lobby.channels?.reduce((acc, cur) => acc + cur.clients, 0) ?? 0,
    [lobby]
  );

  const spaceChannels = useMemo(() => {
    const currentSpaceChannels = lobby.channels?.filter((channel) =>
      channel.roomId.includes(SPACE_ID)
    );

    if (!currentSpaceChannels || currentSpaceChannels.length === 0) return [];

    return currentSpaceChannels.map((channel) => ({
      roomId: channel.roomId,
      clients: channel.clients,
    }));
  }, [lobby]);

  useEffect(() => {
    (async () => {
      await connectToLobby();
      await connectToChannel({
        spaceId: SPACE_ID,
        user: { ...customOptions, playType: 'scrollMode' },
      });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (spaces) {
      console.log(spaces);
    }
  }, [spaces]);

  useEffect(() => {
    if (isMultiplayReady && myPlayer) {
      canvasInitialize(myPlayer);
    }
  }, [isMultiplayReady, myPlayer]);

  useEffect(() => {
    if (isMultiplayReady && myPlayer && players) {
      othersAnimate(myPlayer, players);
    }
  }, [isMultiplayReady, myPlayer, players]);

  return (
    <HomeContainer>
      <p>현재 Lobby 상태 :: {lobby.isLive}</p>
      <p>현재 Lobby 인원 수 :: {lobbyClientCount}</p>
      {spaceChannels.map((channel, channelIndex) => (
        <p key={channelIndex}>
          [Channel] {channel.roomId} : {channel.clients} 명
        </p>
      ))}
      {/* <MultiplayArea /> */}
    </HomeContainer>
  );
}

export default Home;
