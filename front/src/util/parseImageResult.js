export const parseImageResult = (image) => {
  const resultData = image.result ? JSON.parse(image.result) : {};

  const predicted_class = resultData.label || "?";
  const predicted_class_full =
    resultData.predicted_class_full || predicted_class;
  const predicted_probability = resultData.confidences?.[0]?.confidence || 0;
  const confidences = resultData.confidences || [];
  const confidence_score = resultData.confidence_score || 0;
  const confidence_top3_score = resultData.confidence_top3_score || 0;

  return {
    ...image,
    predicted_class,
    predicted_class_full,
    predicted_probability,
    confidences,
    confidence_score,
    confidence_top3_score,
  };
};
