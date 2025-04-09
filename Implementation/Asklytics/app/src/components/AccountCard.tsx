import React from 'react';
import { Account } from '../lib/types';

type AccountCardProps = {
  account: Account;
  onSelect: (account: Account) => void;
};

const AccountCard: React.FC<AccountCardProps> = ({ account, onSelect }) => {
  return (
    <div className="max-w-sm w-full bg-white shadow-lg rounded-lg p-6 border border-gray-200 hover:shadow-xl transition duration-200">
      <div className="flex flex-col items-center space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">{account.displayName}</h3>
        <p className="text-sm text-gray-600">Region: {account.regionCode}</p>
        <p className="text-sm text-gray-600">Created: {new Date(account.createTime).toLocaleString()}</p>
        <p className="text-sm text-gray-600">Updated: {new Date(account.updateTime).toLocaleString()}</p>
        <p className="text-sm text-gray-600">Account Name: {account.name}</p>
        <button
          onClick={() => onSelect(account)}
          className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Select Account
        </button>
      </div>
    </div>
  );
};

export default AccountCard;
