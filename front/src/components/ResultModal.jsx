import React, { useState } from "react";

const Result = ({ analysis }) => {
  const [activeTab, setActiveTab] = useState("summary");

  if (!analysis) return null;

  const {
    filename,
    predicted_class,
    predicted_class_full,
    predicted_probability,
    confidence_score,
    confidence_top3_score,
    llm_message,
  } = analysis;

  const imageUrl = filename
    ? `http://localhost:8000/uploads/${filename}`
    : null;

  const percentage = (predicted_probability * 100).toFixed(1);
  const confidenceDisplay = confidence_score.toFixed(1);
  const confidenceTop3Display =
    typeof confidence_top3_score === "number"
      ? confidence_top3_score.toFixed(1)
      : "-";

  return (
    <div className="w-full max-w-4xl mx-auto bg-white shadow-md rounded-3xl p-8 text-center">
      {imageUrl && (
        <div className="mb-6 flex justify-center">
          <img
            src={imageUrl}
            alt="Uploaded skin lesion"
            className="max-h-64 rounded-2xl shadow-md object-contain"
          />
        </div>
      )}

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

      <div className="flex flex-col items-center gap-6 mb-8">
        {activeTab === "summary" && (
          <div className="flex flex-col items-center gap-6">
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
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
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

            <div className="mt-4 text-left bg-[#F5FAFA] rounded-2xl p-6 max-h-64 overflow-y-auto min-h-[120px] w-full">
              <p className="text-base text-gray-700 whitespace-pre-line">
                {llm_message}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Result;
