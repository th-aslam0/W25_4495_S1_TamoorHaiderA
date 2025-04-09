"use client";

import axios from "axios";
import { useState } from "react";
import { User } from "@/lib/types";
import UserBanner from "@/components/UserBanner";
import useStateStore from "@/lib/store";
import AccountCard from "@/components/AccountCard";

export default function AccountSelection() {
  const { user, accounts } = useStateStore();
  console.log('debug', accounts)
  return (
    <div className="w-full h-screen flex justify-center items-start pt-[5%]">
      <UserBanner user={user} />
      { accounts.map((account, i) => <AccountCard account={account} onSelect={()=>{}} />) }
    </div>
  );
}
