import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
export function Login() {
  const [loginEmail, setloginEmail] = useState("");
  const [loginPass, setloginPass] = useState("");
  const navigate = useNavigate();

  const handlePresetLogin = (type: "admin" | "user") => {
    if (type === "admin") {
      setloginEmail("admin@example.com");
      setloginPass("admin123");
    } else {
      setloginEmail("user@example.com");
      setloginPass("user123");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    navigate("/");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white rounded shadow-md w-96">
        <div className="flex mb-6 space-x-4">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => handlePresetLogin("admin")}
          >
            Admin
          </Button>
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => handlePresetLogin("user")}
          >
            User
          </Button>
        </div>
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label htmlFor="loginEmail">Email</Label>
            <Input
              id="loginEmail"
              type="text"
              value={loginEmail}
              onChange={(e) => setloginEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <Label htmlFor="loginPass">Password</Label>
            <Input
              id="loginPass"
              type="password"
              value={loginPass}
              onChange={(e) => setloginPass(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" onClick={handleSubmit}>
            Log In
          </Button>
        </form>
      </div>
    </div>
  );
}
