import React, { useEffect, useState } from "react";

const riskColors = {
  HIGH: "text-[#334F4F] bg-[#D7F6F5]",
  MEDIUM: "text-[#334F4F] bg-[#EAF7F7]",
  LOW: "text-[#334F4F] bg-[#F3FEFF]",
  UNKNOWN: "text-gray-600 bg-gray-100",
};

const Result = ({ analysis }) => {
  console.log("ANALYSIS RESULT:", analysis);

  const [llmMessage, setLlmMessage] = useState("");
  const [loadingLlm, setLoadingLlm] = useState(false);
  const [activeTab, setActiveTab] = useState("summary");

  if (!analysis) return null;

  const {
    image_id,
    predicted_class,
    predicted_class_full,
    predicted_probability,
    confidence_score,
    confidence_top3_score,
    cancer_probability,
    risk_level,
    recommendation,
  } = analysis;

  const safePercent = (v) => (typeof v === "number" ? `${v.toFixed(1)}%` : "–");

  const safeScore = (v) =>
    typeof v === "number" ? `${v.toFixed(1)}/100` : "–";

  useEffect(() => {
    let cancelled = false;

    if (image_id) {
      setLoadingLlm(true);
      setLlmMessage("");

      fetch(`http://localhost:8000/images/${image_id}/llm_message`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (!cancelled) {
            setLlmMessage(data.llm_message || "No explanation available.");
            setLoadingLlm(false);
          }
        })
        .catch(() => {
          if (!cancelled) {
            setLlmMessage("Could not load explanation.");
            setLoadingLlm(false);
          }
        });
    }

    return () => {
      cancelled = true;
    };
  }, [image_id]);

  return (
    <div className="mt-12 w-full max-w-4xl mx-auto bg-white shadow-md rounded-3xl p-10">
      <h2 className="text-3xl font-semibold text-[#334F4F] mb-6 text-center">
        Analysis Result
      </h2>
      <div className="flex justify-center gap-6 mb-10">
        {["summary", "details"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-full text-lg font-semibold transition
              ${
                activeTab === tab
                  ? "bg-[#4DA19F] text-white"
                  : "bg-[#E8F3F3] text-[#334F4F] hover:bg-[#D5ECEC]"
              }`}
          >
            {tab === "summary" ? "Result" : "Details"}
          </button>
        ))}
      </div>

      {activeTab === "summary" && (
        <div className="flex flex-col items-center gap-8 text-center">
          <div>
            <p className="text-sm uppercase tracking-wide text-gray-500">
              Predicted lesion
            </p>
            <p className="text-3xl font-semibold text-[#334F4F]">
              {predicted_class_full || predicted_class}
            </p>
            <p className="text-xs text-gray-400">{predicted_class}</p>
          </div>

          <div>
            <p className="text-sm uppercase tracking-wide text-gray-500">
              Estimated probability
            </p>
            <p className="text-4xl font-bold text-[#4DA19F]">
              {safePercent(predicted_probability)}
            </p>
          </div>

          <div
            className={`px-6 py-2 rounded-full font-semibold ${
              riskColors[risk_level] || riskColors.UNKNOWN
            }`}
          >
            Risk level: {risk_level || "UNKNOWN"}
          </div>

          {recommendation && (
            <div className="max-w-2xl bg-[#F5FAFA] rounded-2xl p-6 text-gray-700">
              {recommendation}
            </div>
          )}
        </div>
      )}

      {activeTab === "details" && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10 text-center">
            <div>
              <p className="text-sm uppercase tracking-wide text-gray-500">
                Model confidence
              </p>
              <p className="text-2xl font-semibold text-[#334F4F]">
                {safeScore(confidence_score)}
              </p>
            </div>

            <div>
              <p className="text-sm uppercase tracking-wide text-gray-500">
                Cancer probability
              </p>
              <p className="text-2xl font-semibold text-[#334F4F]">
                {safePercent(cancer_probability)}
              </p>
            </div>
          </div>
          <div className="bg-[#F5FAFA] rounded-2xl p-6 max-h-96 overflow-y-auto">
            {loadingLlm ? (
              <div className="flex flex-col items-center text-[#4DA19F]">
                <span className="font-semibold mb-2">Loading explanation…</span>
                <div className="animate-spin h-8 w-8 border-4 border-[#4DA19F] border-t-transparent rounded-full" />
              </div>
            ) : (
              <p className="text-gray-700 whitespace-pre-line">{llmMessage}</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Result;
