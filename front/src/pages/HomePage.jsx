import React from "react";
import backgroundImage from "../assets/img/backgroundImg.png";
import barChart from "../assets/img/bar-chart.png";
import image1 from "../assets/img/back.png";
import image2 from "../assets/img/aiTech.jpg";
import logo from "../assets/img/logo.png";
import pulse from "../assets/img/pulse.png";
import shield from "../assets/img/shield.png";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  
  const navigate = useNavigate();

  const handleMoveToUploadPage = () => {
    navigate("UploadImage");
  };

  return (
    // <header class="flex justify-between items-center px-8 py-2.5">
    //      <img src={logo} class="w-32" alt="logo" />
    // <nav>

    //     <ul>
    //         <li><a href='#'>Home</a></li>
    //         <li><a href='#'>Sking analyzis</a></li>
    //         <li><a href='#'>About</a></li>
    //     </ul>
    // </nav>
    // <a href='#'><button>Login</button></a>
    // </header>
    <>
      {/* Hero Section  */}
      <div className="flex">
        <div className="w-[60%] text-center p-10 mt-20">
          <h1 className="bg-linear-to-r from-[#4DA19F] to-[#334F4F] bg-clip-text text-transparent text-6xl font-bold">
            Stay ahead <br />
            <span className="text-black">of skin concerns.</span>
          </h1>
          <p className="text-2xl mt-10 text-[rgba(0,0,0,0.55)]">
            Advanced AI-powered skin analysis to detect early signs of <br />
            melanoma. Get instant, accurate results from the comfort of your
            home.{" "}
          </p>
          <div className=" flex mt-20 justify-center gap-10">
            <button
              onClick={handleMoveToUploadPage}
              className="w-[260px] h-10 bg-linear-to-r from-[#334F4F] to-[#75B5B5]  rounded-3xl text-2xl text-white"
            >
              Start free analysis
            </button>
            <button className="w-[260px] h-10 bg-white rounded-3xl text-2xl bg-linear-to-r from-[#4DA19F] to-[#334F4F] bg-clip-text text-transparent outline-3 outline-[#4DA19F]">
              Learn how it works
            </button>
          </div>
        </div>
        <div
          className="bg-cover m-10 bg-center w-[40%] max-w-[650px] min-h-[500px] flex items-center justify-center rounded-4xl"
          style={{ backgroundImage: `url(${image1})` }}
        ></div>
      </div>
      <p className="text-base text-center text-[rgba(0,0,0,0.55)]">
        This AI tool is designed to assist in early detection and should not
        replace professional medical advice. <br />
        Always consult with a board-certified dermatologist for diagnosis and
        treatment.{" "}
      </p>

      {/* How it works  */}
      <div className="flex flex-col items-center mt-20">
        <h1 className="bg-linear-to-r from-[#4DA19F] to-[#334F4F] bg-clip-text text-transparent text-6xl font-bold">
          How it works
        </h1>
        <p className="text-base text-center text-[rgba(0,0,0,0.55)]">
          Simple, fast, and accurate skin analysis in four easy steps
        </p>

        <div className="flex flex-row">
          <div className="flex justify-center p-4">
            <div className="relative w-[90%] max-w-[380px] h-[300px] bg-[#ABD3D2] rounded-3xl p-5">
              <div className="w-10 h-10 rounded-full bg-[#4DA19F] flex items-center justify-center text-white text-xl font-bold">
                1
              </div>
              <h2 className="mt-7 text-[#334F4F] text-2xl font-bold">
                Take a photo
              </h2>
              <p className="mt-8 text-base text-center text-[rgba(0,0,0,0.55)]">
                Use your smartphone to take a clear photo of the skin area
                you're concerned about.
              </p>
              <div className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-[#334F4F] flex items-center justify-center text-white text-xl">
                ✔
              </div>
            </div>
          </div>

          <div className="flex justify-center p-4">
            <div className="relative w-[90%] max-w-[380px] h-[300px] bg-[#ABD3D2] rounded-3xl p-5">
              <div className="w-10 h-10 rounded-full bg-[#4DA19F] flex items-center justify-center text-white text-xl font-bold">
                2
              </div>
              <h2 className="mt-7 text-[#334F4F] text-2xl font-bold">
                AI Analysis
              </h2>
              <p className="mt-8 text-base text-center text-[rgba(0,0,0,0.55)]">
                Our advanced AI analyzes your image for signs of melanoma and
                other skin conditions.
              </p>
              <div className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-[#334F4F] flex items-center justify-center text-white text-xl">
                ✔
              </div>
            </div>
          </div>

          <div className="flex justify-center p-4">
            <div className="relative w-[90%] max-w-[380px] h-[300px] bg-[#ABD3D2] rounded-3xl p-5">
              <div className="w-10 h-10 rounded-full bg-[#4DA19F] flex items-center justify-center text-white text-xl font-bold">
                3
              </div>
              <h2 className="mt-7 text-[#334F4F] text-2xl font-bold">
                Instant Results
              </h2>
              <p className="mt-8 text-base text-center text-[rgba(0,0,0,0.55)]">
                Receive a detailed report with risk assessment and recommended
                next steps.
              </p>
              <div className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-[#334F4F] flex items-center justify-center text-white text-xl">
                ✔
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced AI technology  */}
      <div className="mt-30">
        <h1 className="bg-linear-to-r text-center from-[#4DA19F] to-[#334F4F] bg-clip-text text-transparent text-6xl font-bold">
          Advanced AI Technology
        </h1>
        <p className="mt-10 text-base text-center text-[rgba(0,0,0,0.55)]">
          Our algorithm has been trained on thousands of images and validated by
          board-certified dermatologists, achieving over 95% accuracy in
          detecting suspicious lesions.
        </p>
        <div className="flex flex-row mt-20">
          <div className="w-[60%] m-10">
            <div className=" flex flex-row justify-start items-center gap-20 mt-20">
              <img src={barChart} alt="" />
              <h2 className=" text-[#334F4F] text-2xl">
                Deep learning algorithms analyze visual patterns invisible to
                the human eye
              </h2>
            </div>
            <div className=" flex flex-row justify-start items-center gap-20 mt-15">
              <img src={pulse} alt="" />
              <h2 className=" text-[#334F4F] text-2xl">
                Continuous improvement as our AI learns from new data
              </h2>
            </div>
            <div className=" flex flex-row justify-start items-center gap-20 mt-15">
              <img src={shield} alt="" />
              <h2 className=" text-[#334F4F] text-2xl">
                Privacy-focused design ensures your medical data remains secure
              </h2>
            </div>
          </div>
          <div
            className="w-[40%] bg-cover m-10 bg-center max-w-[650px] min-h-[500px] flex items-center justify-center rounded-4xl"
            style={{ backgroundImage: `url(${image2})` }}
          ></div>
        </div>
      </div>

      <div
        className="w-[70%] h-[460px] bg-cover m-10 bg-center  flex flex-col items-center justify-center rounded-4xl  mx-auto"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <h1 className="bg-linear-to-r text-center from-[#E0E7FF] to-[#75B5B5] bg-clip-text text-transparent text-6xl font-bold">
          Take control of your <br />
          skin health today.
        </h1>
        <p className="mt-10 text-xl text-center text-[#D9D9D9]">
          Get your first skin analysis for free. Early detection can save your
          life
        </p>
        <button className="w-[260px] h-10 bg-[#75B5B5] rounded-3xl text-2xl  text-white mt-10">
          get started
        </button>
      </div>
    </>
  );
};

export default HomePage;
