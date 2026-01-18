import React from "react";
import backgroundImage from "../assets/img/backgroundImg.png";
import barChart from "../assets/img/bar-chart.png";
import image1 from "../assets/img/back.png";
import image2 from "../assets/img/aiTech.jpg";
import pulse from "../assets/img/pulse.png";
import shield from "../assets/img/shield.png";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  const handleMoveToUploadPage = () => navigate("UploadImage");
  const handleMoveToEducationPage = () => navigate("EducationPage");

  return (
    <>
      <div className="flex flex-col lg:flex-row items-center px-4 lg:px-20 mt-20 gap-10">
        <div className="lg:w-1/2 text-center lg:text-left">
          <h1 className="bg-linear-to-r from-[#4DA19F] to-[#334F4F] bg-clip-text text-transparent text-4xl sm:text-5xl lg:text-6xl font-bold">
            Stay ahead <br />
            <span className="text-black">of skin concerns.</span>
          </h1>
          <p className="mt-4 sm:mt-6 text-base sm:text-lg lg:text-2xl text-[rgba(0,0,0,0.55)]">
            Advanced AI-powered skin analysis to detect early signs of melanoma.
            Get instant, accurate results from the comfort of your home.
          </p>
          <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 sm:gap-10 mt-6 sm:mt-10">
            <button
              onClick={handleMoveToUploadPage}
              className="w-full sm:w-[260px] h-10 sm:h-12 bg-linear-to-r from-[#334F4F] to-[#75B5B5] rounded-3xl text-xl sm:text-2xl text-white"
            >
              Start free analysis
            </button>

            <button
              onClick={handleMoveToEducationPage}
              className="w-full sm:w-[260px] h-10 sm:h-12 bg-white rounded-3xl text-xl sm:text-2xl bg-linear-to-r from-[#4DA19F] to-[#334F4F] bg-clip-text text-transparent border-2 border-[#4DA19F]"
            >
              Learn how it works
            </button>
          </div>
        </div>

        <div
          className="w-full lg:w-1/2 max-w-[650px] min-h-[300px] sm:min-h-[400px] bg-cover bg-center rounded-4xl"
          style={{ backgroundImage: `url(${image1})` }}
        ></div>
      </div>

      <p className="text-sm sm:text-base text-center text-[rgba(0,0,0,0.55)] px-4 mt-6">
        This AI tool is designed to assist in early detection and should not
        replace professional medical advice. <br />
        Always consult with a board-certified dermatologist for diagnosis and
        treatment.
      </p>

      <div className="flex flex-col items-center mt-12 px-4 lg:px-20">
        <h1 className="bg-linear-to-r from-[#4DA19F] to-[#334F4F] bg-clip-text text-transparent text-3xl sm:text-4xl lg:text-6xl font-bold text-center">
          How it works
        </h1>
        <p className="text-base sm:text-lg text-center text-[rgba(0,0,0,0.55)] mt-2">
          Simple, fast, and accurate skin analysis in four easy steps
        </p>

        <div className="flex flex-col lg:flex-row gap-6 mt-6 lg:mt-12">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className="relative w-full sm:w-[90%] lg:w-[380px] h-[250px] sm:h-[300px] bg-[#ABD3D2] rounded-3xl p-4 flex flex-col items-center"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#4DA19F] flex items-center justify-center text-white font-bold text-lg sm:text-xl">
                {step}
              </div>
              <h2 className="mt-4 sm:mt-7 text-[#334F4F] text-lg sm:text-2xl font-bold text-center">
                {step === 1 && "Take a photo"}
                {step === 2 && "AI Analysis"}
                {step === 3 && "Instant Results"}
              </h2>
              <p className="mt-2 sm:mt-4 text-sm sm:text-base text-center text-[rgba(0,0,0,0.55)]">
                {step === 1 &&
                  "Use your smartphone to take a clear photo of the skin area you're concerned about."}
                {step === 2 &&
                  "Our advanced AI analyzes your image for signs of melanoma and other skin conditions."}
                {step === 3 &&
                  "Receive a detailed report with risk assessment and recommended next steps."}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col lg:flex-row mt-12 px-4 lg:px-20 gap-6">
        <div className="lg:w-1/2 flex flex-col gap-6">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <img src={barChart} alt="" className="w-12 sm:w-16" />
              <h2 className="text-[#334F4F] text-base sm:text-2xl">
                Deep learning algorithms analyze visual patterns invisible to
                the human eye
              </h2>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <img src={pulse} alt="" className="w-12 sm:w-16" />
              <h2 className="text-[#334F4F] text-base sm:text-2xl">
                Continuous improvement as our AI learns from new data
              </h2>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <img src={shield} alt="" className="w-12 sm:w-16" />
              <h2 className="text-[#334F4F] text-base sm:text-2xl">
                Privacy-focused design ensures your medical data remains secure
              </h2>
            </div>
          </div>
        </div>
        <div
          className="lg:w-1/2 w-full max-w-[650px] min-h-[300px] sm:min-h-[400px] bg-cover bg-center rounded-4xl"
          style={{ backgroundImage: `url(${image2})` }}
        ></div>
      </div>

      <div className="flex justify-center">
        <div
          className="w-full max-w-[90%] sm:max-w-[70%] min-h-[300px] sm:min-h-[460px] bg-cover m-6 sm:m-10 bg-center flex flex-col items-center justify-center rounded-4xl text-center px-4"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <h1 className="bg-linear-to-r from-[#E0E7FF] to-[#75B5B5] bg-clip-text text-transparent text-3xl sm:text-5xl lg:text-6xl font-bold">
            Take control of your <br /> skin health today.
          </h1>
          <p className="mt-4 sm:mt-10 text-base sm:text-xl text-[#D9D9D9]">
            Get your first skin analysis for free. Early detection can save your
            life
          </p>
          <button
            className="mt-6 sm:mt-10 w-full sm:w-[260px] h-10 sm:h-12 bg-[#75B5B5] rounded-3xl text-lg sm:text-2xl text-white"
            onClick={handleMoveToUploadPage}
          >
            Get started
          </button>
        </div>
      </div>
    </>
  );
};

export default HomePage;
