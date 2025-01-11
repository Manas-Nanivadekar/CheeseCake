import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../hooks/useReducer";
import { fetchAdditionalData, setCredentials } from "../store/slices/authSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LoginResponse {
  AccessToken: string;
  RefreshToken: string;
  user_id: string;
  role: string;
  organisation_id: string[];
  expiresIn: number;
  createdAt: string;
}

export function Login() {
  const [loginEmail, setloginEmail] = useState("");
  const [loginPass, setloginPass] = useState("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ loginEmail, loginPass }),
      });
      console.log("response", response);
      const data = await response.json();
      const {
        AccessToken,
        RefreshToken,
        user_id,
        role,
        organisation_id,
        expiresIn,
        createdAt,
      } = data as LoginResponse;
      dispatch(
        setCredentials({
          accessToken: AccessToken,
          refreshToken: RefreshToken,
          userId: user_id,
          role: role,
          organisationId: organisation_id,
          expiresIn: expiresIn,
          createdAt: createdAt,
        })
      );
      const result = await dispatch(
        fetchAdditionalData({ userId: user_id, accessToken: AccessToken })
      );
      if (result.payload) {
        navigate("/dashboard");
      } else {
        console.error("Failed to fetch additional data");
        // Handle error (e.g., show error message to user)
      }
    } catch (error) {
      console.error("An error occurred while logging in", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white rounded shadow-md w-96">
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
          <Button type="submit" className="w-full">
            Log In
          </Button>
        </form>
      </div>
    </div>
  );
}