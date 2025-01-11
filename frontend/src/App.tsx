import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import RootLayout from './RootLayout';
import LandingPage from './pages/LandingPage';
import QuizPage from "./pages/QuizPage";
import AgendaSection from "./pages/CreatePathway";
import { Login } from "./pages/Login";
import Content from "./pages/Content";
import GamefiedQuiz from "./pages/Content";

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
        path: "/login",
        index: true,
        element: <Login />,
      },
      {
        path: "/quiztest",
        index: true,
        element: <QuizPage />,
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
        element: <QuizPage />,
      },
      {
        path: "/pathway/view/:id",
        index: true,
        element: <QuizPage />,
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}


