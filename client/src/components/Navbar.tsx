import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { logout } from "../store/authSlice";

export default function Navbar() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <nav className="flex items-center gap-4 border-b px-6 py-4 bg-white">
      <Link to="/" className="text-xl font-bold">
        Roomlie
      </Link>

      <div className="ml-auto flex items-center gap-3">
        <Link to="/" className="hover:underline">
          Terem
        </Link>

        {!user && (
          <>
            <Link to="/login">
              <button className="border px-3 py-1 rounded hover:bg-blue-50 active:brightness-75">
                Bejelentkezés
              </button>
            </Link>

            <Link to="/register">
              <button className="border px-3 py-1 rounded hover:bg-blue-50 active:brightness-75">
                Regisztráció
              </button>
            </Link>
          </>
        )}

        {user?.role === "user" && (
          <>
            <span className="font-semibold">{user.name}</span>

            <Link to="/bookings">
              <button className="border px-3 py-1 rounded hover:bg-blue-50 active:brightness-75">
                Foglalásaim
              </button>
            </Link>
            <Link to="/">
              <button
                onClick={() => dispatch(logout())}
                className="border px-3 py-1 rounded hover:bg-red-50 active:brightness-75"
              >
                Kijelentkezés
              </button>
            </Link>

          </>
        )}

        {user?.role === "admin" && (
          <>
            <span className="font-semibold">
              {user.name} <span className="text-sm text-blue-600">(admin)</span>
            </span>

            <Link to="/admin/bookings">
              <button className="border px-3 py-1 rounded hover:bg-blue-50 active:brightness-75">
                Beérkezett foglalások
              </button>
            </Link>

            <Link to="/">
              <button
                onClick={() => dispatch(logout())}
                className="border px-3 py-1 rounded hover:bg-red-50 active:brightness-75"
              >
                Kijelentkezés
              </button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}