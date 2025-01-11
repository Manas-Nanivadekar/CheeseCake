import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./RootLayout";
import LandingPage from "./pages/LandingPage";
import AgendaSection from "./pages/CreatePathway";
import { Login } from "./pages/Login";
import Content from "./pages/Content";
import GamefiedQuiz from "./pages/Content";
import Leaderboard from "./components/Leaderboard";

const mockLeaderboardData = [
  { id: "1", name: "Alex Thompson", score: 10, rank: 1 },
  { id: "2", name: "Sarah Chen", score: 9, rank: 2 },
  { id: "3", name: "Mike Rodriguez", score: 8, rank: 3 },
  { id: "4", name: "Emma Wilson", score: 3 },
  { id: "5", name: "James Lee", score: 2 },
  { id: "6", name: "Lisa Wang", score: 1 },
  { id: "7", name: "David Kim", score: 0 },
  { id: "8", name: "Anna Smith", score: 0 },
];

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "/",
        index: true,
        element: <LandingPage />,
      },
      {
        path: "/pathway/create",
        index: true,
        element: <AgendaSection />,
      },
      {
        path: "/pathway/view",
        index: true,
        element: <GamefiedQuiz />,
      },
      {
        path: "/pathway/view/:id",
        index: true,
        element: <Content />,
      },
      {
        path: "/leaderboard",
        index: true,
        element: <Leaderboard entries={mockLeaderboardData} />,
      },
    ],
  },
  {
    path: "/login",
    index: true,
    element: <Login />,
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
