import { Counter } from "./components/Counter";
import { FetchData } from "./components/FetchData";
import { Home } from "./components/Home";
import { Game } from "./components/Game";
import { Rules } from "./components/Rules";

const AppRoutes = [
  {
    index: true,
    element: <Home />
  },
  {
    path: '/counter',
    element: <Counter />
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
    path: '/rules',
    element: <Rules />
  }
];

export default AppRoutes;
