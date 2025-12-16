
import { createBrowserRouter } from "react-router";
import Root from './../Pages/Root/Root';
import Home from "../Pages/Home/Home";
import WellnessList from "../components/WellnessList/WellnessList";
import ChatPage from "../Pages/ChatPage/ChatPage";
import Registration from "../components/Authentication/Registration";
import Login from "../components/Authentication/Login";



const router = createBrowserRouter([
    {
       
        path: "/",
        element: <Root />,
        errorElement: <div>404 Not Found</div>,
        children: [
        {
            index: true,
            path: "/",
            element:<Home />
        },
        {
            path:"/chat",
            element:<ChatPage />
        },
        {
            path:"/todo",
            element:<WellnessList />
        },
        {
            path:"/registration",
            element:<Registration />
        },
        {
            path:"/login",
            element:<Login/>
        }

    ]
    },

]);
export { router };