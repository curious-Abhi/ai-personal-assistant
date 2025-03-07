"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useGoogleLogin } from "@react-oauth/google";
import { getAuthUserData } from "@/services/GlobalApi";

function SignIn() {
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log(tokenResponse);
      if(typeof window!==undefined){
        localStorage.setItem("user_token", JSON.stringify(tokenResponse.access_token));
      }
      const user=getAuthUserData(tokenResponse.access_token);
      console.log(user);
    },
    onError: (errorResponse) => console.log(errorResponse),
  });
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 px-4">
      <motion.div
        className="bg-white p-8 rounded-2xl shadow-xl text-center w-full max-w-md"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Image
          src="/logo.svg"
          alt="Aura Assist"
          width={80}
          height={80}
          priority
        />

        <h1 className="text-3xl font-bold mt-4 text-gray-900">
          Welcome to Aura Assist
        </h1>
        <p className="text-gray-500 mt-2">
          Sign in to access your AI assistant
        </p>

        <Button onClick={() => googleLogin}>Sign in with Google</Button>

        <p className="text-gray-400 text-sm mt-4">
          By signing in, you agree to our{" "}
          <a href="#" className="text-blue-500 hover:underline">
            Terms of Service
          </a>
          .
        </p>
      </motion.div>
    </div>
  );
}

export default SignIn;
