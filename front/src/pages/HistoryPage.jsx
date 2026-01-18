import { LuCalendar, LuTrash2 } from "react-icons/lu";
import { deleteImage, getImageById, getImages } from "../api/images";
import { useEffect, useState } from "react";

import ResultModal from "../components/ResultModal";
import { useNavigate } from "react-router-dom";

const parseImageResult = (image) => {
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

const HistoryPage = () => {
  const [images, setImages] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getImages()
      .then((data) => {
        const parsedData = data.map(parseImageResult);
        setImages(parsedData);
      })
      .catch(console.error);
  }, []);

  const handleOpenModal = async (imageId) => {
    try {
      const data = await getImageById(imageId);
      const parsedImage = parseImageResult(data);
      setAnalysis(parsedImage);
      setIsModalOpen(true);
    } catch (err) {
      console.error(err);
      alert("Nie udało się wczytać danych obrazu");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteImage(imageToDelete);
      setImages((prev) => prev.filter((img) => img.id !== imageToDelete));
      setDeleteModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("Nie udało się usunąć zdjęcia");
    }
  };

  return (
    <div className="mt-10">
      <div>
        <h1 className="text-[#334F4F] text-5xl font-semibold text-center">
          Historia Analiz
        </h1>
        <p className="text-[#4B5563] text-xl text-center mt-5">
          Track changes in your skin over time and monitor your progress.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 w-full max-w-8xl mx-auto px-30 my-20">
        {images.map((img) => {
          const imageUrl = img.filename
            ? `http://localhost:8000/uploads/${img.filename}`
            : null;

          return (
            <div
              key={img.id}
              onClick={() => handleOpenModal(img.id)}
              className="relative group h-full p-4 bg-[#75B5B533] cursor-pointer rounded-3xl flex flex-col items-center gap-4 hover:bg-[#75B5B555] transition-colors"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setImageToDelete(img.id);
                  setDeleteModalOpen(true);
                }}
                className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-white p-2 rounded-full shadow-md hover:bg-red-50"
              >
                <LuTrash2 className="text-red-500 text-xl" />
              </button>

              <h3 className="text-[#334F4F] text-2xl font-semibold">
                {img.predicted_class_full}
              </h3>

              {imageUrl && (
                <img
                  src={imageUrl}
                  alt={img.filename}
                  className="w-[90%] h-48 object-cover shadow-md rounded-xl"
                />
              )}

              <div className="flex gap-2 items-center">
                <LuCalendar className="text-2xl text-[#4DA19F]" />
                <h4 className="text-xl font-semibold">
                  {new Date(img.upload_time).toLocaleDateString()}
                </h4>
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-6 max-w-5xl w-full relative">
            <button
              onClick={() => {
                setIsModalOpen(false);
                setAnalysis(null);
              }}
              className="absolute top-4 right-4 text-xl font-bold"
            >
              ✕
            </button>

            {analysis && <ResultModal analysis={analysis} />}
          </div>
        </div>
      )}

      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-6 w-[90%] max-w-md shadow-xl">
            <h2 className="text-2xl font-semibold text-[#334F4F] mb-4">
              Usunąć zdjęcie?
            </h2>
            <p className="text-gray-600 mb-6">Tej operacji nie można cofnąć.</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300"
              >
                Anuluj
              </button>
              <button
                onClick={() => handleDelete()}
                className="px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600"
              >
                Usuń
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
