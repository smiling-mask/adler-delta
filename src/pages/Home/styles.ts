import styled from 'styled-components';

export const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

export const MultiplayArea = styled.div.attrs({ id: 'multiplay-area' })`
  margin-top: 2.5rem;
  width: 37.5rem;
  height: 50rem;
`;

export const ReactPlayerWrapper = styled.div`
  width: 62.5rem;
  height: 62.5rem;
`;
