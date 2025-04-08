import { ChevronDown, ChevronUp } from "@/lib/const";
import { Step } from "@/types";
import { useEffect, useState } from "react";

const GenerationSteps = ({ steps, done }: { steps: Step[]; done: boolean }) => {
    const [hidden, setHidden] = useState(false);
  
    useEffect(() => {
      if (done) setHidden(true);
    }, [done]);
  
    return (
      <div className="border border-gray-700 rounded mt-5 p-3 flex flex-col">
        <button
          className="w-full text-left flex items-center justify-between"
          onClick={() => setHidden(!hidden)}
        >
          Steps {hidden ? <ChevronDown /> : <ChevronUp />}
        </button>
  
        {!hidden && (
          <div className="flex gap-2 mt-2">
            <div className="pt-2 flex flex-col items-center shrink-0">
              <span
                className={`inline-block w-3 h-3 transition-colors rounded-full ${
                  !done ? "animate-pulse bg-emerald-400" : "bg-gray-500"
                }`}
              ></span>
  
              <div className="w-[1px] grow border-l border-gray-700"></div>
            </div>
  
            <div className="space-y-2.5">
              {steps.map((step, j) => {
                return (
                  <div key={j}>
                    <p>{step.name}</p>
  
                    <div className="flex flex-wrap items-center gap-1 mt-1">
                      {Object.entries(step.result).map(([key, value]) => {
                        return (
                          <p
                            key={key}
                            className="text-xs px-1.5 py-0.5 bg-gray-800 rounded text-white"
                          >
                            {key}: {value}
                          </p>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
};

export default GenerationSteps;
