import React, { useRef, useState } from "react";

import uploadIcon from "../assets/img/cloud-computing.png";
import { uploadImage } from "../api/ImageUploadApi";
import Result from "../components/Result";

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
      const token = localStorage.getItem("token"); // lub z kontekstu auth
      const result = await uploadImage(image.file, token);
      setUploadResult(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const selectFile = () => {
    fileInputRef.current.click();
  };

  const onFileSelect = (event) => {
    const file = event.target.files[0];
    handleFile(file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    handleFile(file);
  };

  const handleFile = (file) => {
    if (!file || file.type.split("/")[0] !== "image") return;
    setImage({
      name: file.name,
      url: URL.createObjectURL(file),
      file, // <-- przechowujemy cały plik do wysyłki
    });
  };

  const changeImage = () => {
    setImage(null);
  };

  return (
    <section className="flex flex-col items-center p-10">
      <div className="text-center">
        <h1 className="font-medium text-5xl text-[#334F4F]">
          Upload image of your skin
        </h1>
        <p className="mt-3 text-[#141414] text-xl">
          For the most accurate analysis, please upload a clear, well-lit image
          of the area of concern.
        </p>
      </div>

      <div
        className={`relative w-[650px] h-[400px] mt-20 rounded-3xl flex flex-col justify-center items-center border-2 border-dashed overflow-hidden transition-colors ${
          isDragging
            ? "border-[#4DA19F] bg-[#4DA19F22]"
            : "border-[#4DA19F1A] bg-[#4DA19F1A]"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Jeśli zdjęcie NIE jest jeszcze wybrane */}
        {!image && (
          <>
            <img
              className="w-[100px] h-[90px]"
              src={uploadIcon}
              alt="upload icon"
            />
            <h1 className="text-3xl font-medium text-[#75B5B5]">
              Drag and drop your image here
            </h1>
            <p className="text-lg font-normal text-gray-600">
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
              className="mt-10 px-6 py-2 bg-linear-to-r from-[#4DA19F] to-[#334F4F] text-white font-semibold rounded-2xl text-xl"
            >
              Upload image
            </button>
          </>
        )}

        {/* Jeśli zdjęcie zostało załadowane */}
        {image && (
          <>
            <img
              src={image.url}
              alt={image.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute bottom-5 left-0 right-0 flex justify-center">
              <button
                onClick={changeImage}
                className="px-6 py-2 bg-linear-to-r from-[#4DA19F] to-[#334F4F] text-white font-semibold rounded-2xl text-lg shadow-md"
              >
                Click to change image
              </button>
            </div>
          </>
        )}
      </div>

      {/* Start Analysis Button */}
      {image && (
        <button
          onClick={handleStartAnalysis}
          disabled={uploading}
          className="mt-10 px-6 py-2 bg-linear-to-r from-[#4DA19F] to-[#334F4F] text-white font-semibold rounded-2xl text-lg shadow-md"
        >
          {uploading ? "Uploading..." : "Start analysis"}
        </button>
      )}

      {/* Pokazanie wyniku lub błędu */}
      {uploadResult && <Result analysis={uploadResult} />}

      {error && (
        <div className="mt-5 p-4 bg-red-100 text-red-700 rounded">
          Error: {error}
        </div>
      )}
    </section>
  );
};

export default ImageUploadPage;
