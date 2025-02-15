import { RouterProvider } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import "./App.css";
import router from "./routes";
import { AuthProvider } from "@/contexts/AuthContext";

function App() {
  return (
    <AuthProvider>
      <SnackbarProvider>
        <RouterProvider router={router} />
      </SnackbarProvider>
    </AuthProvider>
  );
}

export default App;
