import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../store/authSlice";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Neptun-Code": import.meta.env.VITE_NEPTUN_CODE
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      if (!response.ok) {
        alert("Hibás email vagy jelszó");
        return;
      }

      const data = await response.json();

      dispatch(loginSuccess(data));

      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Szerverhiba");
    }
  }

  return (
    <div className="flex justify-center mt-10">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 w-80"
      >
        <h1 className="text-2xl font-bold">Bejelentkezés</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          type="password"
          placeholder="Jelszó"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded"
        />

        <button
          type="submit"
          className="border p-2 rounded bg-blue-500 text-white"
        >
          Bejelentkezés
        </button>
      </form>
    </div>
  );
}