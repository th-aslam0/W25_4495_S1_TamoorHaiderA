"use client";

import useStateStore from "@/lib/store";
import axios from "axios";
import { IncompleteJsonParser } from "incomplete-json-parser";
import { useState } from "react";

export default function ReviewBox() {
    const [input, setInput] = useState("");
    const [response, setResponse] = useState("");
    const [url, setUrl] = useState("");
    const { accessToken, selectedProperty } = useStateStore();
    const [responseText, setResponseText] = useState("");
    const [loading, setLoading] = useState(false);
    const parser = new IncompleteJsonParser();

    const handleUrlChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const newUrl = e.target.value;
        setUrl(newUrl);

        if (!newUrl.startsWith("https")) return;

        try {
            const res = await axios.post("http://localhost:8000/reviews", { url: newUrl });
            setResponseText(res.data);
            submitReviewsData(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const submitReviewsData = async (reviews: string) => {
        setResponse("");
        setLoading(true);
        console.log("taimoor", reviews);

        try {
            const res = await fetch(`http://localhost:8000/review-invoke`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    body: reviews,
                }),
            });

            if (!res.ok) {
                throw new Error("Error");
            }

            const data = res.body;
            if (!data) {
                return;
            }

            const reader = data.getReader();
            const decoder = new TextDecoder();
            let done = false;
            let answer = { answer: "", tools_used: [] };
            let currentSteps: { name: string; result: Record<string, string> }[] = [];
            let buffer = "";

            while (!done) {
                const { value, done: doneReading } = await reader.read();
                done = doneReading;
                let chunkValue = decoder.decode(value);
                if (!chunkValue) continue;

                buffer += chunkValue;

                if (buffer.includes("</step_name>")) {
                    const stepNameMatch = buffer.match(/<step_name>([^<]*)<\/step_name>/);
                    if (stepNameMatch) {
                        const [_, stepName] = stepNameMatch;
                        try {
                            if (stepName !== "final_answer") {
                                const fullStepPattern =
                                    /<step><step_name>([^<]*)<\/step_name>([^<]*?)(?=<step>|<\/step>|$)/g;
                                const matches = [...buffer.matchAll(fullStepPattern)];

                                for (const match of matches) {
                                    const [fullMatch, matchStepName, jsonStr] = match;
                                    if (jsonStr) {
                                        try {
                                            const result = JSON.parse(jsonStr);
                                            currentSteps.push({ name: matchStepName, result });
                                            buffer = buffer.replace(fullMatch, "");
                                        } catch (error) {
                                            // handle partial/incomplete json errors silently
                                        }
                                    }
                                }
                            } else {
                                const jsonMatch = buffer.match(
                                    /(?<=<step><step_name>final_answer<\/step_name>)(.*)/
                                );
                                if (jsonMatch) {
                                    const [_, jsonStr] = jsonMatch;
                                    parser.write(jsonStr);
                                    const result = parser.getObjects();
                                    answer = result;

                                    if (typeof answer.answer === "string") {
                                        const formatted = answer.answer.replace(/\\n/g, "\n");
                                        setResponseText(formatted);
                                    }

                                    parser.reset();
                                }
                            }
                        } catch (e) {
                            console.log("Failed to parse step:", e);
                        }
                    }
                }
            }
        } catch (err) {
            console.error(err);
            setResponse("⚠️ Error while streaming response.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container max-w-2xl mx-auto m-10 space-y-6">
            <div className="flex justify-center">
                <input
                    type="text"
                    value={url}
                    onChange={handleUrlChange}
                    placeholder="Enter your Business URL for People Sentiments Analysis..."
                    className="w-full p-3 rounded-lg shadow-inner bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-green-400 outline-none transition-all duration-200"
                />
            </div>

            {loading && (
                <div className="text-center text-green-400 animate-pulse">
                    Analyzing sentiment... please wait ✨
                </div>
            )}

            {!loading && responseText && (
                <textarea
                    value={responseText}
                    readOnly
                    className="w-full h-64 p-4 rounded-lg bg-gray-900 text-white border border-green-500 resize-none shadow-inner whitespace-pre-wrap"
                />
            )}
        </div>
    );
}
