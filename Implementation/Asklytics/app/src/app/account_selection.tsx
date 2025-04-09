"use client";

import { useState } from "react";
import { Account, User } from "@/lib/types";
import UserBanner from "@/components/UserBanner";
import AccountCard from "@/components/AccountCard";
import useStateStore from "@/lib/store";
import axios from "axios";

export default function AccountSelection() {
  const { user, accounts, accessToken, setProperties, setSelectedProperty } = useStateStore();
  
  const getAccountProperties = async (account: Account) => {
    const properties = await axios.get(
    `https://analyticsadmin.googleapis.com/v1beta/properties?access_token=${accessToken}&filter=parent:${account.name}`,
    );
    setProperties(properties.data.properties);
    
    console.log('debug', properties);
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center pt-[5%] bg-gray-100">
      <UserBanner user={user} />
      <h1 className="text-2xl font-semibold text-gray-900 text-center mt-6">Linked Accounts</h1>
      <div className="w-full max-w-screen-xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 px-4">
        {accounts.map((account, i) => (
          <AccountCard key={i} account={account} onSelect={getAccountProperties} onPropertySelect={setSelectedProperty} />
        ))}
      </div>
    </div>
  );
}
