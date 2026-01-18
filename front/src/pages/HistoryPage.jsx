import { LuCalendar, LuTrash2 } from "react-icons/lu";
import { deleteImage, getImageById, getImagesHistory } from "../api/images";
import { useEffect, useState } from "react";

import ResultModal from "../components/ResultModal";

const parseImageResult = (image) => {
  const resultData = image.result ? JSON.parse(image.result) : {};
  return {
    ...image,
    predicted_class: resultData.label || "?",
    predicted_class_full:
      resultData.predicted_class_full || resultData.label || "?",
    predicted_probability: resultData.confidences?.[0]?.confidence || 0,
    confidences: resultData.confidences || [],
    confidence_score: resultData.confidence_score || 0,
    confidence_top3_score: resultData.confidence_top3_score || 0,
    llm_message: resultData.llm_message || "",
  };
};

const HistoryPage = () => {
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(0);
  const [limit] = useState(8);
  const [hasMore, setHasMore] = useState(true);
  const [analysis, setAnalysis] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);

  const loadImages = async (pageNum = 0) => {
    const data = await getImagesHistory(pageNum * limit, limit);

    console.log(
      "PAGE:",
      pageNum,
      "IDS:",
      data.map((d) => d.id),
    );

    const parsed = data.map(parseImageResult);

    if (pageNum === 0) {
      setImages(parsed);
    } else {
      setImages((prev) => [...prev, ...parsed]);
    }

    setHasMore(data.length === limit);
  };

  useEffect(() => {
    loadImages(0);
  }, []);

  const handleNextPage = () => {
    if (!hasMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    loadImages(nextPage);
  };

  const handleOpenModal = async (imageId) => {
    try {
      const data = await getImageById(imageId);
      setAnalysis(parseImageResult(data));
      setIsModalOpen(true);
    } catch (err) {
      console.error(err);
      alert("Could not load image");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteImage(imageToDelete);
      setImages((prev) => prev.filter((img) => img.id !== imageToDelete));
      setDeleteModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("Could not delete image");
    }
  };

  return (
    <div className="mt-10">
      <h1 className="text-center text-5xl font-semibold text-[#334F4F]">
        Analysis History
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 w-full max-w-8xl mx-auto px-30 my-20">
        {images.map((img, index) => (
          <div
            key={`${img.id}-${index}`}
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
            {img.filename && (
              <img
                src={`http://localhost:8000/uploads/${img.filename}`}
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
        ))}
      </div>

      {hasMore && (
        <div className="text-center mb-10">
          <button
            onClick={handleNextPage}
            className="px-6 py-2 rounded-xl bg-[#4DA19F] text-white hover:bg-[#3B867F]"
          >
            Load more
          </button>
        </div>
      )}

      {isModalOpen && analysis && (
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
            <ResultModal analysis={analysis} />
          </div>
        </div>
      )}

      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-6 w-[90%] max-w-md shadow-xl">
            <h2 className="text-2xl font-semibold text-[#334F4F] mb-4">
              Delete an image?
            </h2>
            <p className="text-gray-600 mb-6">This action cannot be undone.</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
