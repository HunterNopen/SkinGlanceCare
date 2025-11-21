import React from "react";
import bodyImg2 from "../assets/img/bodyImg2.jpg";
import { useNavigate } from "react-router-dom";

const SignUpPage = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/SignIn");
  };

  return (
    <>
      <main class="flex items-center justify-center bg-[#ABD3D2] w-full h-screen px-[5%] xl:px-[10%]">
        <section class=" w-full mx-auto h-[85%] bg-white flex flex-row px-[5%] 2xl:px-[10%]">
          <form class="lg:w-[60%] w-full flex flex-col justify-center items-center lg:items-stretch 2xl:py-20">
            <h1 class="2xl:text-5xl text-5xl font-semibold 2xl:my-20 my-10">
              Sign up
            </h1>
            <div class="flex xl:flex-row flex-col gap-[5%] w-full">
              <div class="flex flex-col items-center lg:items-stretch 2xl:mt-0 xl:mt-5">
                <label for="name" class="block text-3xl text-gray-700 mb-2">
                  Name{" "}
                </label>
                <input
                  type="text"
                  class="xl:w-full w-[70%] h-[50px] border-3 border-[#E8E8E8] text-[#535353] bg-[#f8f8f8] text-2xl rounded-2xl font-normal"
                />
              </div>
              <div class="flex flex-col items-center lg:items-stretch 2xl:mt-0 xl:mt-5 mt-5 ">
                <label for="email" class="block text-3xl text-gray-700 mb-2">
                  Email{" "}
                </label>
                <input
                  type="email"
                  class="xl:w-full w-[70%] h-[50px] border-3 border-[#E8E8E8] text-[#535353] bg-[#f8f8f8] text-2xl rounded-2xl font-normal"
                />
              </div>
            </div>
            <div class="flex flex-col items-center lg:items-stretch 2xl:mt-10 xl:mt-5 mt-5 w-full">
              <label for="password" class="block text-3xl text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                class="xl:w-full w-[70%] max-w-[600px] h-[50px] border-3 border-[#E8E8E8] text-[#535353] bg-[#f8f8f8] text-2xl rounded-2xl font-normal"
              />
            </div>
            <div class="2xl:mt-20 mt-10">
              <input type="checkbox" class="w-5 h-5 mr-2" />
              <lablel
                for="checkbox"
                class="xl:text-xl text-l text-gray-700 mb-2 mt-10"
              >
                I agree to the{" "}
                <span class="text-[#4DA19F]">Terms of Service</span> and{" "}
                <span class="text-[#4DA19F]">Privacy Policy</span>
              </lablel>
            </div>
            <div class="w-full flex 2xl:mt-20 mt-10 justify-center lg:justify-start">
              <button class="flex xl:text-2xl text-xl items-center justify-center h-[50px] w-[30%] p-0 bg-linear-to-r from-[#4DA19F] to-[#334F4F] text-white font-semibold rounded-2xl">
                Get started
              </button>
            </div>

            <p class="2xl:mt-15 mt-5">
              Already got an account?{" "}
              <span class="text-[#4DA19F]" onClick={handleLogin}>login here</span>
            </p>
          </form>
          <div class="lg:flex hidden w-[40%] justify-center items-center overflow-hidden m-5 ">
            <img
              src={bodyImg2}
              class="w-full h-auto object-contain rounded-2xl"
            />
          </div>
        </section>
      </main>
    </>
  );
};

export default SignUpPage;
