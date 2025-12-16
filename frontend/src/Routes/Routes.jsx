
import { createBrowserRouter } from "react-router";
import Root from './../Pages/Root/Root';
import Home from "../Pages/Home/Home";
import WellnessList from "../components/WellnessList/WellnessList";
import ChatPage from "../Pages/ChatPage/ChatPage";
import Registration from "../components/Authentication/Registration";
import Login from "../components/Authentication/Login";
import Dashboard from "../Pages/Dashboard/Dashboard";
import Root_2 from "../Pages/Root/Root_2";



const router = createBrowserRouter([
  {
    element: <Root />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: "/registration",
        element: <Registration />
      },
      {
        path: "/login",
        element: <Login />
      }
    ]
  },

  {
    element: <Root_2 />,
    children: [
      {
        path: "/chat",
        element: <ChatPage />
      },
      {
        path: "/todo",
        element: <Dashboard />
      }
    ]
  }
]);
export { router };