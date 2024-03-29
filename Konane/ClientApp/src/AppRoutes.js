import { Home } from "./components/Home";
import { Rules } from "./components/Rules";
import InitGame from "./components/InitGame";
import GameOptions from "./components/GameOptions";

const AppRoutes = [
  {
    index: true,
    element: <Home />
  },
  {
    path: '/rules',
    element: <Rules />
  },
  {
    path: '/game-options',
    element: <InitGame />
  },
  {
    path: '/game-room',
    element: <GameOptions />
  }
];

export default AppRoutes;
