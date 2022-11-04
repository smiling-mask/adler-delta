import { useEffect } from 'react';

import { HomeContainer } from './styles';

import useMultiplay from '../../hooks/multiplay/useMultiplay';
import { UserCustomOptions } from '../../hooks/multiplay/types';

const customOptions: UserCustomOptions = {
  type: 'female',
  hair: 1,
  face: 1,
  top: 1,
  bottom: 1,
  shoes: 1,
};

function Home(): JSX.Element {
  const { players, connectToLobby, connectToChannel } = useMultiplay();

  useEffect(() => {
    (async () => {
      await connectToLobby();
      await connectToChannel({
        spaceId: '6530b9da-ddcf-4ab1-8b2e-3f8d90b6d1bb',
        user: { ...customOptions, playType: 'scrollMode' },
      });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <HomeContainer>
      <p>{JSON.stringify(players)}</p>
    </HomeContainer>
  );
}

export default Home;
