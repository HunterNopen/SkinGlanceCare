import React from "react";
import backgroundImage from "../assets/img/backgroundImg.png";
import imageEdu from "../assets/img/aiTech.jpg";
import { useNavigate } from "react-router-dom";

const EducationPage = () => {
  const navigate = useNavigate();
  const handleMoveToUploadPage = () => navigate("/UploadImage");

  return (
    <>
      <div className="text-center flex flex-col  items-center px-4 lg:px-20 mt-20 gap-10">
        <div className="lg:w-1/2 text-center lg:text-left">
          <h1 className="bg-linear-to-r from-[#4DA19F] to-[#334F4F] bg-clip-text text-transparent text-4xl sm:text-5xl lg:text-6xl font-bold">
            EDUCATION
            <br />
            <span className="text-black">How to read the test results?</span>
          </h1>
          <p className="mt-4 sm:mt-6 text-base sm:text-lg lg:text-2xl text-[rgba(0,0,0,0.55)]">
            Below you will find an explanation of what each result parameter
            means and how to interpret the information received.
          </p>
          <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 sm:gap-10 mt-6 sm:mt-10">
            <button
              onClick={handleMoveToUploadPage}
              className="w-full sm:w-[260px] h-10 sm:h-12 bg-linear-to-r from-[#334F4F] to-[#75B5B5] rounded-3xl text-xl sm:text-2xl text-white"
            >
              Start free analysis
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center mt-12 px-4 lg:px-20">
        <div className="w-full max-w-[1100px]">
          <div className="bg-[#F6FEFF] rounded-4xl p-6 sm:p-10 mb-8 shadow-sm">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#334F4F]">
              1. What does our model do?
            </h2>
            <p className="mt-4 text-base sm:text-lg text-[rgba(0,0,0,0.65)]">
              Our system analyzes a photo of a skin lesion and assesses whether
              there is a risk that the lesion is malignant. The result is not a
              medical diagnosis, but it may help in deciding on further steps
              (e.g., consulting a dermatologist).
            </p>
            <p className="mt-3 text-base sm:text-lg text-[rgba(0,0,0,0.65)]">
              The model has been optimized to work quickly and efficiently on a
              regular device, so the analysis is fast and the result appears
              shortly.
            </p>
          </div>
          <div className="bg-[#F6FEFF] rounded-4xl p-6 sm:p-10 mb-8 shadow-sm">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#334F4F]">
              2. What do the results mean?
            </h2>
            <div className="mt-6">
              <h3 className="text-xl sm:text-2xl font-bold text-[#334F4F]">
                Cancer probability
              </h3>
              <p className="mt-3 text-base sm:text-lg text-[rgba(0,0,0,0.65)]">
                This indicator shows how high the risk is that the lesion is
                malignant.
              </p>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-3xl bg-[#D7F6F5]">
                  <div className="font-bold text-lg text-[#334F4F]">≥ 50%</div>
                  <div className="text-sm sm:text-base text-[rgba(0,0,0,0.65)] mt-1">
                    HIGH risk
                  </div>
                  <div className="text-sm sm:text-base text-[rgba(0,0,0,0.65)] mt-2">
                    Urgent dermatological consultation recommended.
                  </div>
                </div>

                <div className="p-4 rounded-3xl bg-[#EAF7F7]">
                  <div className="font-bold text-lg text-[#334F4F]">30–49%</div>
                  <div className="text-sm sm:text-base text-[rgba(0,0,0,0.65)] mt-1">
                    MEDIUM risk
                  </div>
                  <div className="text-sm sm:text-base text-[rgba(0,0,0,0.65)] mt-2">
                    Consider a follow-up check or consultation.
                  </div>
                </div>

                <div className="p-4 rounded-3xl bg-[#F3FEFF]">
                  <div className="font-bold text-lg text-[#334F4F]">
                    {"< 30%"}
                  </div>
                  <div className="text-sm sm:text-base text-[rgba(0,0,0,0.65)] mt-1">
                    LOW risk
                  </div>
                  <div className="text-sm sm:text-base text-[rgba(0,0,0,0.65)] mt-2">
                    Recommended to monitor the lesion (e.g., take follow-up
                    photos).
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <h3 className="text-xl sm:text-2xl font-bold text-[#334F4F]">
                Risk level
              </h3>
              <p className="mt-3 text-base sm:text-lg text-[rgba(0,0,0,0.65)]">
                This is a simplified interpretation based on the cancer
                probability.
              </p>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-3xl bg-[#D7F6F5]">
                  <div className="font-bold text-lg text-[#334F4F]">HIGH</div>
                  <div className="text-sm sm:text-base text-[rgba(0,0,0,0.65)] mt-1">
                    The lesion looks suspicious
                  </div>
                  <div className="text-sm sm:text-base text-[rgba(0,0,0,0.65)] mt-2">
                    Contact a dermatologist as soon as possible
                  </div>
                </div>

                <div className="p-4 rounded-3xl bg-[#EAF7F7]">
                  <div className="font-bold text-lg text-[#334F4F]">MEDIUM</div>
                  <div className="text-sm sm:text-base text-[rgba(0,0,0,0.65)] mt-1">
                    Risk cannot be excluded
                  </div>
                  <div className="text-sm sm:text-base text-[rgba(0,0,0,0.65)] mt-2">
                    Consider consultation or monitoring
                  </div>
                </div>

                <div className="p-4 rounded-3xl bg-[#F3FEFF]">
                  <div className="font-bold text-lg text-[#334F4F]">LOW</div>
                  <div className="text-sm sm:text-base text-[rgba(0,0,0,0.65)] mt-1">
                    The lesion appears benign
                  </div>
                  <div className="text-sm sm:text-base text-[rgba(0,0,0,0.65)] mt-2">
                    Observe the lesion and take follow-up photos
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <h3 className="text-xl sm:text-2xl font-bold text-[#334F4F]">
                Certainty score
              </h3>
              <p className="mt-3 text-base sm:text-lg text-[rgba(0,0,0,0.65)]">
                This shows how confident the model is in its assessment.
              </p>
              <p className="mt-2 text-base sm:text-lg text-[rgba(0,0,0,0.65)]">
                If the model indicates a specific class but has low confidence,
                the result may be less reliable and it is worth consulting a
                doctor.
              </p>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-4 gap-4">
                {[
                  {
                    range: "80–99",
                    label: "The model is very confident",
                    action: "The result is highly reliable",
                  },
                  {
                    range: "60–79",
                    label: "Moderate confidence",
                    action: "The result is likely reliable",
                  },
                  {
                    range: "40–59",
                    label: "Low confidence",
                    action: "Consider a consultation",
                  },
                  {
                    range: "< 40",
                    label: "The model is uncertain",
                    action: "Doctor evaluation recommended",
                  },
                ].map((item) => (
                  <div
                    key={item.range}
                    className="p-4 rounded-3xl bg-[#F6F9F9]"
                  >
                    <div className="font-bold text-lg text-[#334F4F]">
                      {item.range}
                    </div>
                    <div className="text-sm sm:text-base text-[rgba(0,0,0,0.65)] mt-1">
                      {item.label}
                    </div>
                    <div className="text-sm sm:text-base text-[rgba(0,0,0,0.65)] mt-2">
                      {item.action}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-8">
              <h3 className="text-xl sm:text-2xl font-bold text-[#334F4F]">
                Is the result “atypical”? (Out-of-distribution / OOD)
              </h3>
              <p className="mt-3 text-base sm:text-lg text-[rgba(0,0,0,0.65)]">
                Sometimes a photo may differ from the images the model was
                trained on (e.g., unusual lighting, blur, different background).
                In such cases, the model may mark the result as “atypical”.
              </p>
              <p className="mt-2 text-base sm:text-lg text-[rgba(0,0,0,0.65)]">
                If you see information about an atypical sample, it means that:
              </p>
              <ul className="list-disc list-inside mt-2 text-base sm:text-lg text-[rgba(0,0,0,0.65)]">
                <li>the model cannot assess the lesion confidently,</li>
                <li>
                  it is worth retaking the photo or consulting a dermatologist.
                </li>
              </ul>
            </div>
          </div>
          <div className="bg-[#F6FEFF] rounded-4xl p-6 sm:p-10 mb-8 shadow-sm">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#334F4F]">
              3. What do you receive in the result?
            </h2>
            <p className="mt-4 text-base sm:text-lg text-[rgba(0,0,0,0.65)]">
              After the analysis, the system returns the result in the form of:
            </p>
            <ul className="list-disc list-inside mt-3 text-base sm:text-lg text-[rgba(0,0,0,0.65)]">
              <li>the lesion class (e.g., melanoma, mole, keratosis),</li>
              <li>probability of this class,</li>
              <li>risk level (HIGH / MEDIUM / LOW),</li>
              <li>model certainty (how reliable the result is),</li>
              <li>information about an atypical sample, if applicable.</li>
            </ul>
          </div>
          <div className="bg-[#F6FEFF] rounded-4xl p-6 sm:p-10 mb-12 shadow-sm">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#334F4F]">
              4. Most important: what to do after receiving the result?
            </h2>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-3xl bg-[#D7F6F5]">
                <div className="font-bold text-lg text-[#334F4F]">HIGH</div>
                <div className="text-sm sm:text-base text-[rgba(0,0,0,0.65)] mt-1">
                  Contact a dermatologist urgently.
                </div>
              </div>
              <div className="p-4 rounded-3xl bg-[#EAF7F7]">
                <div className="font-bold text-lg text-[#334F4F]">MEDIUM</div>
                <div className="text-sm sm:text-base text-[rgba(0,0,0,0.65)] mt-1">
                  Consider a follow-up or consultation.
                </div>
              </div>
              <div className="p-4 rounded-3xl bg-[#F3FEFF]">
                <div className="font-bold text-lg text-[#334F4F]">LOW</div>
                <div className="text-sm sm:text-base text-[rgba(0,0,0,0.65)] mt-1">
                  Monitor the lesion and take follow-up photos.
                </div>
              </div>
              <div className="p-4 rounded-3xl bg-[#F6F9F9]">
                <div className="font-bold text-lg text-[#334F4F]">
                  Uncertain / atypical
                </div>
                <div className="text-sm sm:text-base text-[rgba(0,0,0,0.65)] mt-1">
                  Best to consult a doctor.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EducationPage;
