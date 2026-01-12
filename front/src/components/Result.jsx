import React, { useEffect, useState } from "react";

const Result = ({ analysis }) => {
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
  } = analysis;

  const percentage = (predicted_probability * 100).toFixed(1);
  const confidenceDisplay = confidence_score.toFixed(1);
  const confidenceTop3Display =
    typeof confidence_top3_score === "number"
      ? confidence_top3_score.toFixed(1)
      : "-";

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
            setLlmMessage(data.llm_message);
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
    <div className="mt-10 w-full max-w-4xl mx-auto bg-white shadow-md rounded-3xl p-10 text-center">
      <h2 className="text-3xl font-semibold text-[#334F4F] mb-6">
        Analysis Result
      </h2>

      <div className="flex justify-center gap-6 mb-8">
        <button
          onClick={() => setActiveTab("summary")}
          className={`px-6 py-2 rounded-full text-lg font-semibold transition
            ${
              activeTab === "summary"
                ? "bg-[#4DA19F] text-white"
                : "bg-[#E8F3F3] text-[#334F4F] hover:bg-[#D5ECEC]"
            }`}
        >
          Result
        </button>

        <button
          onClick={() => setActiveTab("details")}
          className={`px-6 py-2 rounded-full text-lg font-semibold transition
            ${
              activeTab === "details"
                ? "bg-[#4DA19F] text-white"
                : "bg-[#E8F3F3] text-[#334F4F] hover:bg-[#D5ECEC]"
            }`}
        >
          Details
        </button>
      </div>

      {activeTab === "summary" && (
        <div className="flex flex-col items-center gap-8 mb-8">
          <div className="flex flex-col items-center">
            <span className="text-sm uppercase tracking-wide text-gray-500 mb-1">
              Predicted disease
            </span>
            <span className="text-3xl font-semibold text-[#334F4F]">
              {predicted_class_full || predicted_class}
            </span>
            <span className="text-xs uppercase tracking-wide text-gray-400 mt-1">
              {predicted_class}
            </span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-sm uppercase tracking-wide text-gray-500 mb-1">
              Probability
            </span>
            <span className="text-4xl font-bold text-[#4DA19F]">
              {percentage}%
            </span>
          </div>
        </div>
      )}

      {activeTab === "details" && (
        <>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-8">
            <div className="flex flex-col items-center">
              <span className="text-sm uppercase tracking-wide text-gray-500 mb-1">
                Confidence (full)
              </span>
              <span className="text-2xl font-semibold text-[#334F4F]">
                {confidenceDisplay}/100
              </span>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-sm uppercase tracking-wide text-gray-500 mb-1">
                Confidence (top 3)
              </span>
              <span className="text-2xl font-semibold text-[#334F4F]">
                {confidenceTop3Display}/100
              </span>
            </div>
          </div>

          <div className="mt-4 text-left bg-[#F5FAFA] rounded-2xl p-6 max-h-96 overflow-y-auto min-h-[120px]">
            {loadingLlm ? (
              <div className="w-full flex flex-col items-center justify-center">
                <span className="text-lg text-[#4DA19F] font-semibold mb-2">
                  Loading explanation...
                </span>
                <svg
                  className="animate-spin h-8 w-8 text-[#4DA19F]"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
              </div>
            ) : (
              <p className="text-base text-gray-700 whitespace-pre-line">
                {llmMessage}
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Result;
