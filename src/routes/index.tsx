import Create from "@/pages/Create/Create";
import Decide from "@/pages/Decide/Decide";
import Home from "@/pages/Home/Home";
import Result from "@/pages/Result/Result";
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/create", element: <Create /> },
  { path: "/decide/:id", element: <Decide /> },
  { path: "/result/:id", element: <Result /> },
]);

export default router;
