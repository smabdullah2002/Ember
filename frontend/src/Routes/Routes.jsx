import { createBrowserRouter } from "react-router";
import Root from './../Pages/Root/Root';
import Home from "../Pages/Home/Home";
import ChatPage from "../Pages/ChatPage/ChatPage";
import Registration from "../components/Authentication/Registration";
import Login from "../components/Authentication/Login";
import Dashboard from "../Pages/Dashboard/Dashboard";
import Root_2 from "../Pages/Root/Root_2";
import Moodkit from "../Pages/Moodkit/Moodkit";
import MoodBoard from "../Pages/MoodBoard/MoodBoard";
import MoodDashboard from "../Pages/MoodDashboard/MoodDashboard";
import MentalHealthHub from "@/components/Helphub/Helphub";
import CommunitySupportForum from "@/components/Community/Post";
import UserProfile from "@/Pages/Profile/Profile";



const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: "registration",
        element: <Registration />
      },
      {
        path: "login",
        element: <Login />
      }
    ]
  },

  {
    path:"/user",
    element: <Root_2 />,
    children: [
      {
        path: "chat",
        element: <ChatPage />
      },
      {
        path: "dashboard",
        element: <Dashboard />
      },
      {
        path: "moodkit",
        element: <Moodkit />
      },
      {
        path: "moodboard",
        element: <MoodBoard />
      },
      {
        path: "mood-dashboard",
        element: <MoodDashboard />
      },
      {
        path:"helphub",
        element:<MentalHealthHub/>
      },
      {
        path:"community",
        element:<CommunitySupportForum/>
      },
      {
        path: "profile",
        element:<UserProfile/>
      }
    ]
  }
]);
export { router };