import MarkdownRenderer from "@/components/MarkdownRenderer";
import { type ChatOutput } from "@/lib/types";
import GenerationSteps from "./GenerationSteps";

const Output = ({ output }: { output: ChatOutput }) => {
  const detailsHidden = !!output.result?.answer;
  return (
    <div className="border-t border-gray-700 py-10 first-of-type:pt-0 first-of-type:border-t-0">
      <p className="text-3xl">{output.question}</p>

      {/* Steps */}
      {output.steps.length > 0 && (
        <GenerationSteps steps={output.steps} done={detailsHidden} />
      )}

      {/* Output */}
      <div
        className="mt-5 prose dark:prose-invert min-w-full prose-pre:whitespace-pre-wrap"
        style={{
          overflowWrap: "anywhere",
        }}
      >
        <MarkdownRenderer content={output.result?.answer || ""} />
      </div>

      {/* Tools */}
      {output.result?.tools_used?.length > 0 && (
        <div className="flex items-baseline mt-5 gap-1">
          <p className="text-xs text-gray-500">Tools used:</p>

          <div className="flex flex-wrap items-center gap-1">
            {output.result.tools_used.map((tool, i) => (
              <p
                key={i}
                className="text-xs px-1 py-[1px] bg-gray-800 rounded text-white"
              >
                {tool}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};


export default Output;
