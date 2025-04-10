"use client";

import React, { useState } from 'react';
import { Account, Property } from '@/lib/types';
import useStateStore from '@/lib/store';

type AccountCardProps = {
    account: Account;
    onSelect: (account: Account) => Promise<void>;
    onPropertySelect?: (property: Property) => void;
};

const AccountCard: React.FC<AccountCardProps> = ({ account, onSelect, onPropertySelect }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const { properties } = useStateStore();

    const filteredProperties: Property[] = properties.filter(
        (prop) => prop.account === account.name
    );

    const handleClick = async () => {
        await onSelect(account); // fetch logic
        setIsExpanded((prev) => !prev); // toggle
    };

    return (
        <div className="max-w-sm w-full bg-white shadow-lg rounded-lg p-6 border border-gray-200 hover:shadow-xl transition duration-200">
            <div className="flex flex-col items-center space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">{account.displayName}</h3>
                <p className="text-sm text-gray-600">Region: {account.regionCode}</p>
                <p className="text-sm text-gray-600">Created: {new Date(account.createTime).toLocaleString()}</p>
                <p className="text-sm text-gray-600">Updated: {new Date(account.updateTime).toLocaleString()}</p>
                <p className="text-sm text-gray-600">Account Name: {account.name}</p>

                <button
                    onClick={handleClick}
                    className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
                >
                    {isExpanded ? "Hide Properties" : "Fetch Account Properties"}
                </button>

                {isExpanded && (
                    <div className="w-full mt-4 border-t border-gray-200 pt-4 space-y-3 text-left">
                        <h4 className="text-md font-semibold text-gray-700">Properties</h4>
                        {filteredProperties.length > 0 ? (
                            filteredProperties.map((prop) => (
                                <div
                                    key={prop.name}
                                    className="flex justify-between items-center p-3 bg-gray-100 rounded-md shadow-inner"
                                >
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">{prop.displayName}</p>
                                        <p className="text-xs text-gray-600">Timezone: {prop.timeZone}</p>
                                        <p className="text-xs text-gray-500">ID: {prop.name}</p>
                                    </div>
                                    <button
                                        onClick={() => onPropertySelect?.(prop)}
                                        className="ml-4 text-sm bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md"
                                    >
                                        Select
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-500">No properties found.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AccountCard;
