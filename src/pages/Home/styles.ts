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
