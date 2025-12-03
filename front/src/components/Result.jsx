const Result = ({ analysis }) => {
  if (!analysis) return null;

  const {
    predicted_class,
    predicted_class_full,
    predicted_probability,
    confidence_score,
    confidence_top3_score,
    llm_message,
  } = analysis;

  const percentage = (predicted_probability * 100).toFixed(1);
  const confidenceDisplay = confidence_score.toFixed(1);
  const confidenceTop3Display =
    typeof confidence_top3_score === "number"
      ? confidence_top3_score.toFixed(1)
      : "-";

  return (
    <div className="mt-10 w-full max-w-4xl mx-auto bg-white shadow-md rounded-3xl p-10 text-center">
      <h2 className="text-3xl font-semibold text-[#334F4F] mb-6">
        Analysis Result
      </h2>

      <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-8">
        <div className="flex flex-col items-center">
          <span className="text-sm uppercase tracking-wide text-gray-500 mb-1">
            Predicted class
          </span>
          <span className="text-2xl md:text-3xl font-semibold text-[#334F4F]">
            {predicted_class_full || predicted_class}
          </span>
          <span className="text-xs uppercase tracking-wide text-gray-400 mt-1">
            {predicted_class}
          </span>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-sm uppercase tracking-wide text-gray-500 mb-1">
            Model probability
          </span>
          <span className="text-2xl md:text-3xl font-semibold text-[#4DA19F]">
            {percentage}%
          </span>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-sm uppercase tracking-wide text-gray-500 mb-1">
            Confidence (full)
          </span>
          <span className="text-2xl md:text-3xl font-semibold text-[#334F4F]">
            {confidenceDisplay}/100
          </span>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-sm uppercase tracking-wide text-gray-500 mb-1">
            Confidence (top 3)
          </span>
          <span className="text-2xl md:text-3xl font-semibold text-[#334F4F]">
            {confidenceTop3Display}/100
          </span>
        </div>
      </div>

      <div className="mt-4 text-left bg-[#F5FAFA] rounded-2xl p-6 max-h-96 overflow-y-auto">
        <p className="text-base text-gray-700 whitespace-pre-line">{llm_message}</p>
      </div>
    </div>
  );
};

export default Result;
