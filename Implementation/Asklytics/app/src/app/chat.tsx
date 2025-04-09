"use client";

import Output from "@/components/Output";
import TextArea from "@/components/TextArea";
import UserBanner from "@/components/UserBanner";
import { type ChatOutput } from "@/lib/types";
import { useState } from "react";

export default function Chat() {
  const [outputs, setOutputs] = useState<ChatOutput[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  return (
    <div
      className={`container pt-10 pb-32 min-h-screen ${
        outputs.length === 0 && "flex items-center justify-center"
      }`}
    >
      <div className="w-full">
        {outputs.length === 0 && (
          <h1 className="text-2xl text-center mb-5">
            Hello to Asklytics - COMP-4495 - Applied Research Project
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
  );
}
