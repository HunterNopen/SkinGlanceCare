import React from "react";
import { useState } from "react";
import axios from "axios";
import { useAuthStore } from '../store/authStore';
const Analysis = () => {
const { saveAnalysisResult, isSaving, error: saveError } = useAuthStore();
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [analysisError, setAnalysisError] = useState("");

  


  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
    setResult(null);
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!file) return setAnalysisError("Please select a file.");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      setAnalysisError("");
      setResult(null);

      const response = await axios.post(
        "http://localhost:8000/analyze-image",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      setResult(response.data);
    } catch (err) {
      console.analysisError(err);
      setAnalysisError("Analysis failed.");
    } finally {
      setUploading(false);

    }
  };

 const handleSave = async () => {
  if (!result) return;
  await saveAnalysisResult(result.filename, result.cancer_probability);
};

  return (
    <div>
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md text-black">
        <h2 className="text-xl font-bold mb-4">Analyze Medical Image</h2>

        <form onSubmit={handleAnalyze}>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Preview"
              className="mt-4 w-full rounded-md"
            />
          )}

          <button
            type="submit"
            disabled={uploading}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
               {uploading ? "Analyzing..." : "Analyze Image"}
          </button>

  {!analysisError && result && (
  <button
    type="button" // ⛔ NIE submit!
    onClick={handleSave}
    disabled={isSaving}
    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
  >
    {isSaving ? "Saving..." : "Save"}
  </button>
)}
         
        </form>

        {analysisError && <p className="mt-4 text-red-500">{analysisError}</p>}
        {result && (
          <div className="mt-4 p-4 bg-gray-100 rounded">
            <p>
              <strong>Filename:</strong> {result.filename}
            </p>
            <p>
              <strong>Probability of Cancer:</strong>{" "}
              {(result.cancer_probability * 100).toFixed(1)}%
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analysis;
