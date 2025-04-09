"use client";

import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";
import Chat from "./chat";
import { useState } from "react";
import GoogleLogin from "@/components/GoogleLogin";
import UserBanner from "@/components/UserBanner";
import { User } from "@/lib/types";
import AccountSelection from "./account_selection";
import useStateStore from "@/lib/store";

export default function Home() {
  const { user, setUser, setAccounts } = useStateStore();

  const googleLogin = useGoogleLogin({
    scope: 'https://www.googleapis.com/auth/analytics.readonly https://www.googleapis.com/auth/analytics.edit',
    onSuccess: async (tokenResponse) => {
      console.log(tokenResponse);
      const user = await axios.get(
        'https://www.googleapis.com/oauth2/v3/userinfo',
        { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } },
      );
      const accountsInfo = await axios.get(
        `https://analyticsadmin.googleapis.com/v1beta/accounts?access_token=${tokenResponse.access_token}`,
      );
      console.log(user, accountsInfo);
      setUser(user.data);
      setAccounts(accountsInfo.data.accounts);
    },
    onError: errorResponse => console.log(errorResponse),
  });

  return (
    <div>
      {!user ? <GoogleLogin googleLogin={googleLogin} /> : <AccountSelection /> /*<Chat />*/}
    </div>
  );
}
