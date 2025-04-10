"use client";

import Output from "@/components/Output";
import TextArea from "@/components/TextArea";
import useStateStore from "@/lib/store";
import { Account, type ChatOutput } from "@/lib/types";
import { useState } from "react";

export default function Chat() {
  const [outputs, setOutputs] = useState<ChatOutput[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { user, accounts, selectedProperty } = useStateStore();

  const selectedAccount: Account | undefined = accounts.find(
    (account) => selectedProperty?.account === account.name
  );

  return (
    <div>
      <div className="container bg-gray-900 text-green-400 font-mono text-sm p-4 rounded-lg shadow-md w-full max-w-2xl overflow-auto flex items-center justify-center">
        <pre>
          <code>
            {`User: ${user?.name ?? "N/A"}
Account:  ${selectedAccount?.displayName ?? "N/A"}
Property: ${selectedProperty?.displayName ?? "N/A"}`
            }
          </code>
        </pre>
      </div>

      <div
        className={`container pt-10 pb-32 min-h-screen bg-gray-700 ${outputs.length === 0 && "flex items-center justify-center"
          }`}
      >
        <div className="w-full">
          {outputs.length === 0 && (
            <h1 className="text-2xl text-center mb-5">
              Welcome to Asklytics - COMP-4495 - Applied Research Project
            </h1>
          )}

          <TextArea
            setIsGenerating={setIsGenerating}
            isGenerating={isGenerating}
            outputs={outputs}
            setOutputs={setOutputs}
          />

          {outputs.map((output, i) => {
            return <Output key={i} output={output} />;
          })}
        </div>
      </div>
    </div>

  );
}
