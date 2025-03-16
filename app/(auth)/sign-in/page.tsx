"use client";

import React, { useContext } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useGoogleLogin } from "@react-oauth/google";
import { getAuthUserData } from "@/services/GlobalApi";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AuthContext } from "@/context/AuthContext";

function SignIn() {
  const createUser = useMutation(api.users.createUser); 
  const {user,setUser}=useContext(AuthContext);
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log("Google Token:", tokenResponse);

      if (typeof window !== "undefined") {
        localStorage.setItem("user_token", JSON.stringify(tokenResponse.access_token));
      }

      const user = await getAuthUserData(tokenResponse.access_token);
      
      if (!user) {
        console.error("Failed to fetch user data");
        return;
      }

      console.log("Fetched User:", user);

      const result = await createUser({
        name: user.name,
        email: user.email,
        picture: user.picture,
      });

      console.log("User Created:", result);
      setUser(result);
    },
    onError: (errorResponse) => console.error("Google Login Error:", errorResponse),
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 px-4">
      <motion.div
        className="bg-white p-8 rounded-2xl shadow-xl text-center w-full max-w-md"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Image src="/logo.svg" alt="Aura Assist" width={80} height={80} priority />

        <h1 className="text-3xl font-bold mt-4 text-gray-900">
          Welcome to Aura Assist
        </h1>
        <p className="text-gray-500 mt-2">Sign in to access your AI assistant</p>

        <Button onClick={() => googleLogin()}>Sign in with Google</Button>

        <p className="text-gray-400 text-sm mt-4">
          By signing in, you agree to our{" "}
          <a href="#" className="text-blue-500 hover:underline">Terms of Service</a>.
        </p>
      </motion.div>
    </div>
  );
}

export default SignIn;
