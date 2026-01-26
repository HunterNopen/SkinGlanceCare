import React, { useState } from "react";

import EducationPage from "../pages/EducationPage";
import { Info } from "lucide-react";
import { Link } from "react-router-dom";

const riskColors = {
  HIGH: "text-[#334F4F] bg-[#D7F6F5]",
  MEDIUM: "text-[#334F4F] bg-[#EAF7F7]",
  LOW: "text-[#334F4F] bg-[#F3FEFF]",
  UNKNOWN: "text-[#334F4F] bg-gray-100",
};

const Result = ({ analysis }) => {
  console.log("ANALYSIS in Result:", analysis);
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
    risk_level,
    recommendation,
    cancer_probability,
  } = analysis;

  const imageUrl = filename
    ? `${import.meta.env.VITE_BASE_URL}/uploads/${filename}`
    : null;

  const safePercent = (v) => (typeof v === "number" ? `${v.toFixed(1)}%` : "–");
  const safeScore = (v) =>
    typeof v === "number" ? `${v.toFixed(1)}/100` : "–";

  return (
    <div className="w-full max-w-4xl mx-auto bg-white shadow-md rounded-3xl   ">
      <h2 className="text-3xl font-semibold text-[#334F4F] mb-6 text-center">
        Analysis Result
      </h2>

      {imageUrl && (
        <div className="mb-6 flex justify-center">
          <img
            src={imageUrl}
            alt="Uploaded skin lesion"
            className="max-h-64 rounded-2xl shadow-md object-contain"
          />
        </div>
      )}

      <div className="flex justify-center gap-6 mb-10 ">
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
        <div className="flex flex-col items-center gap-8 text-center mt-20">
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
          <div className="flex items-center justify-center gap-10 mb-8">
            <h3 className="text-xl font-semibold text-[#334F4F]">
              Detailed metrics
            </h3>

            <Link
              to="/EducationPage"
              className="flex items-center gap-2 text-gray-400 hover:text-[#4DA19F] transition"
              title="Learn how to interpret these metrics"
            >
              <Info size={18} />
              <span className="text-sm hidden sm:inline">
                How to read results
              </span>
            </Link>
          </div>

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
            <p className="text-gray-700 whitespace-pre-line">
              {llm_message || "No explanation available."}
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default Result;
