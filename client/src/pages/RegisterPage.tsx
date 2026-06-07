import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      console.log(import.meta.env.VITE_API_URL);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      if (!response.ok) {
        alert("Sikertelen regisztráció");
        return;
      }

      alert("Sikeres regisztráció");

      navigate("/login");
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
        <h1 className="text-2xl font-bold">Regisztráció</h1>

        <input
          type="text"
          placeholder="Név"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded"
        />

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
          className="border p-2 rounded bg-green-500 text-white"
        >
          Regisztráció
        </button>
      </form>
    </div>
  );
}