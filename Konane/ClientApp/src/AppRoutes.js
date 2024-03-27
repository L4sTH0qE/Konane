import { FetchData } from "./components/FetchData";
import { Home } from "./components/Home";
import { Game } from "./components/Game";
import { GameOptions } from "./components/GameOptions";
import { Rules } from "./components/Rules";

const AppRoutes = [
  {
    index: true,
    element: <Home />
  },
  {
    path: '/fetch-data',
    element: <FetchData />
  },
  {
    path: '/start-game',
    element: <Game />
  },
  {
    path: '/game',
    element: <GameOptions />
  },
  {
    path: '/rules',
    element: <Rules />
  }
];

export default AppRoutes;
