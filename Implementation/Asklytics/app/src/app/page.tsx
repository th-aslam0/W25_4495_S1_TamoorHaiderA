"use client";

import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";
import Chat from "./chat";
import { useState } from "react";
import GoogleLogin from "@/components/GoogleLogin";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const googleLogin = useGoogleLogin({
    scope: 'https://www.googleapis.com/auth/analytics.readonly https://www.googleapis.com/auth/analytics.edit',
    onSuccess: async (tokenResponse) => {
      console.log(tokenResponse);
      const userInfo = await axios.get(
        'https://www.googleapis.com/oauth2/v3/userinfo',
        { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } },
      );
      setIsLoggedIn(true);
      console.log(userInfo);
    },
    onError: errorResponse => console.log(errorResponse),
  });

  return (
    <div>
      { !isLoggedIn ? <GoogleLogin  googleLogin={ googleLogin } /> : <Chat /> }
    </div>
  );
}
