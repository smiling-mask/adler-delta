import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { AppContainer } from './styles';

import Home from '../pages/Home';

import { Path } from '../constants';

function App(): JSX.Element {
  return (
    <AppContainer>
      <BrowserRouter>
        <Routes>
          <Route path={Path.home} element={<Home />} />
        </Routes>
      </BrowserRouter>
    </AppContainer>
  );
}

export default App;
