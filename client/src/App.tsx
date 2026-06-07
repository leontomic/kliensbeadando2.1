import { BrowserRouter, Routes, Route } from "react-router-dom";
import Room from "./components/Room";
import ViewSwitcher from "./components/ViewSwitcher";
import Navbar from "./components/Navbar.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import { TableProvider } from "./context/TableContext";
import type { RootState } from "./store/store";
import { useSelector } from "react-redux";

function App() {
  const user = useSelector((state: RootState) => state.auth.user);
  return (
    <BrowserRouter>
      <TableProvider>
        <Navbar />

        <Routes>
          <Route
            path="/"
            element={
              <div className="flex flex-col items-center gap-2">
                <div className="flex flex-col 2xl:flex-row">
                  <Room />
                  {user?.role && <ViewSwitcher />}
                </div>
              </div>
            }
          />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </TableProvider>
    </BrowserRouter>
  );
}

export default App;