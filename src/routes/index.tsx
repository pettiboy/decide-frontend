import { AuthProvider } from "@/contexts/AuthContext";
import Create from "@/pages/Create/Create";
import Decide from "@/pages/Decide/Decide";
import Home from "@/pages/Home/Home";
import MyDecisions from "@/pages/MyDecisions/MyDecisions";
import Result from "@/pages/Result/Result";
import { createBrowserRouter } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  return <AuthProvider requireAuth>{children}</AuthProvider>;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthProvider>
        <Home />
      </AuthProvider>
    ),
  },
  {
    path: "/create",
    element: (
      <ProtectedRoute>
        <Create />
      </ProtectedRoute>
    ),
  },
  {
    path: "/vote/:id",
    element: (
      <ProtectedRoute>
        <Decide />
      </ProtectedRoute>
    ),
  },
  {
    path: "/result/:id",
    element: (
      <ProtectedRoute>
        <Result />
      </ProtectedRoute>
    ),
  },
  {
    path: "/my-decisions",
    element: (
      <ProtectedRoute>
        <MyDecisions />
      </ProtectedRoute>
    ),
  },
]);

export default router;
