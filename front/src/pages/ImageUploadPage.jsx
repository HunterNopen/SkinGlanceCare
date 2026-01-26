import React, { useRef, useState } from "react";

import Result from "../components/Result";
import uploadIcon from "../assets/img/cloud-computing.png";
import { uploadImage } from "../api/ImageUploadApi";

const ImageUploadPage = () => {
  const [image, setImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const fileInputRef = useRef(null);

  const handleStartAnalysis = async () => {
    if (!image) return;
    setUploading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const result = await uploadImage(image.file, token);
      setUploadResult(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const selectFile = () => fileInputRef.current.click();
  const onFileSelect = (event) => handleFile(event.target.files[0]);
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleFile = (file) => {
    if (!file || file.type.split("/")[0] !== "image") return;
    setImage({ name: file.name, url: URL.createObjectURL(file), file });
  };

  const changeImage = () => setImage(null);

  return (
    <section className="flex flex-col items-center px-4 sm:px-6 lg:px-20 py-10">
      <div className="text-center max-w-3xl">
        <h1 className="font-medium text-4xl sm:text-5xl text-[#334F4F]">
          Upload image of your skin
        </h1>
        <p className="mt-3 text-gray-800 text-lg sm:text-xl">
          For the most accurate analysis, please upload a clear, well-lit image
          of the area of concern.
        </p>
      </div>

      <div
        className={`relative w-full max-w-[650px] h-[300px] sm:h-[400px] mt-10 sm:mt-20 rounded-3xl flex flex-col justify-center items-center border-2 border-dashed overflow-hidden transition-colors ${
          isDragging
            ? "border-[#4DA19F] bg-[#4DA19F22]"
            : "border-[#4DA19F1A] bg-[#4DA19F1A]"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {!image && (
          <>
            <img
              className="w-16 h-16 sm:w-24 sm:h-24"
              src={uploadIcon}
              alt="upload icon"
            />
            <h1 className="text-2xl sm:text-3xl font-medium text-[#75B5B5] mt-4">
              Drag and drop your image here
            </h1>
            <p className="text-base sm:text-lg text-gray-600 mt-1">
              or click to browse your files
            </p>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={onFileSelect}
              hidden
            />
            <button
              onClick={selectFile}
              className="mt-6 sm:mt-10 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-[#4DA19F] to-[#334F4F] text-white font-semibold rounded-2xl text-base sm:text-xl shadow-md"
            >
              Upload image
            </button>
          </>
        )}

        {image && (
          <>
            <img
              src={image.url}
              alt={image.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute bottom-4 sm:bottom-5 left-0 right-0 flex justify-center">
              <button
                onClick={changeImage}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-[#4DA19F] to-[#334F4F] text-white font-semibold rounded-2xl text-base sm:text-lg shadow-md"
              >
                Click to change image
              </button>
            </div>
          </>
        )}
      </div>

      {image && (
        <button
          onClick={handleStartAnalysis}
          disabled={uploading}
          className="mt-6 sm:mt-10 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-[#4DA19F] to-[#334F4F] text-white font-semibold rounded-2xl text-base sm:text-lg shadow-md"
        >
          {uploading ? "Uploading..." : "Start analysis"}
        </button>
      )}

      {uploadResult && (
        <Result
          analysis={{
            image_id: uploadResult.image_id,
            filename: uploadResult.filename || null,
            predicted_class: uploadResult.result.predicted_class,
            predicted_class_full: uploadResult.result.predicted_class_full,
            predicted_probability: uploadResult.result.predicted_probability,
            confidence_score: uploadResult.result.certainty_score,
            confidence_top3_score: null,
            cancer_probability: uploadResult.result.cancer_probability,
            risk_level: uploadResult.result.risk_level,
            recommendation: uploadResult.result.recommendation,
            llm_message: uploadResult.result.llm_message, // jeśli masz w response
          }}
        />
      )}

      {error && (
        <div className="mt-4 sm:mt-5 p-3 sm:p-4 bg-red-100 text-red-700 rounded text-center">
          Error: {error}
        </div>
      )}
    </section>
  );
};

export default ImageUploadPage;
