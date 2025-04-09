import { User } from '@/lib/types';
import React from 'react';

const UserBanner = ({user} : User) => {
    console.log(user, user.name);

    return (
        <div className="w-full h-screen flex justify-center items-start pt-[5%]">
        <div className="w-1/2 bg-white border border-gray-200 shadow-md rounded-lg p-4 flex items-center gap-6">
          <img
            src={user.picture}
            alt={user.name}
            className="w-16 h-16 rounded-full border border-gray-300"
          />
          <div className="flex flex-col">
            <span className="text-lg font-semibold text-gray-900">{user.name}</span>
            <span className="text-sm text-gray-700">{user.email}</span>
            <span className="text-sm text-green-600">
              {user.email_verified ? '✅ Email verified' : '❌ Email not verified'}
            </span>
            <span className="text-xs text-gray-400">Google ID: {user.sub}</span>
          </div>
        </div>
      </div>
    );
};

export default UserBanner;
