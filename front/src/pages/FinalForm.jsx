import { Form, Link, useNavigation, useSearchParams } from "react-router-dom";

import React from "react";
import bodyImg2 from "../assets/img/back.png";
import { useActionData } from "react-router-dom";
import { useState } from "react";

const FinalForm = () => {
  const data = useActionData();
  const navigation = useNavigation();
  const isSubmiting = navigation.state === "submitting";
  const [acceptedPolicy, setAcceptedPolicy] = useState(false);
  const [searchParams] = useSearchParams();
  const isLogin = searchParams.get("mode") === "login";

  return (
    <main className="flex items-center justify-center bg-[#ABD3D2] w-full h-screen px-[5%] xl:px-[10%]">
      <section className="w-full mx-auto h-[85%] bg-white flex flex-row px-[5%] 2xl:px-[10%]">
        <Form
          method="post"
          action={`/auth?mode=${isLogin ? "login" : "add_user"}`}
          className="lg:w-[60%] w-full flex flex-col justify-center items-center lg:items-stretch 2xl:py-20"
        >
          <h1 className="2xl:text-5xl text-5xl font-semibold 2xl:my-20 my-10 capitalize">
            {data && data.errors && (
              <ul>
                {Object.values(data.errors).map((err) => (
                  <li key={err}>{err}</li>
                ))}
              </ul>
            )}
            {data && data.message && <li>{data.message}</li>}
            {isLogin ? "Sign in" : "Sign up"}
          </h1>

          <div className="flex xl:flex-row flex-col gap-[5%] w-full">
            {!isLogin && (
              <div className="flex flex-col items-center lg:items-stretch 2xl:mt-0 xl:mt-5">
                <label
                  htmlFor="name"
                  className="block text-3xl text-gray-700 mb-2"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="first_name"
                  className="xl:w-full w-[70%] h-[50px] border-3 border-[#E8E8E8] 
                    text-[#535353] bg-[#f8f8f8] text-2xl rounded-2xl font-normal"
                />
              </div>
            )}

            <div className="flex flex-col items-center lg:items-stretch 2xl:mt-0 xl:mt-5 mt-5 ">
              <label
                htmlFor="email"
                className="block text-3xl text-gray-700 mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="xl:w-full w-[70%] h-[50px] border-3 border-[#E8E8E8] 
                  text-[#53553 bg-[#f8f8f8] text-2xl rounded-2xl font-normal"
              />
            </div>
          </div>

          <div className="flex flex-col items-center lg:items-stretch 2xl:mt-10 xl:mt-5 mt-5 w-full">
            <label
              htmlFor="password"
              className="block text-3xl text-gray-700 mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="xl:w-full w-[70%] xl:max-w-[278px] h-[50px] border-3 border-[#E8E8E8] 
                text-[#535353] bg-[#f8f8f8] text-2xl rounded-2xl font-normal"
            />
            {isLogin ? (
              <p>
                Forgot password?{" "}
                <Link
                  to="/ForgotPassword"
                  className="text-[#4DA19F] cursor-pointer"
                >
                  Click here
                </Link>
              </p>
            ) : (
              ""
            )}
          </div>

          {!isLogin && (
            <div className="mt-6 flex items-start gap-3 max-w-[600px]">
              <input
                type="checkbox"
                id="accept_policy"
                name="accept_policy"
                required
                checked={acceptedPolicy}
                onChange={(e) => setAcceptedPolicy(e.target.checked)}
                className="mt-1 h-5 w-5 accent-[#4DA19F] cursor-pointer"
              />

              <label
                htmlFor="accept_policy"
                className="text-sm xl:text-base text-gray-600"
              >
                I agree to the{" "}
                <Link
                  to="/PolicyPage"
                  className="text-[#4DA19F] underline hover:text-[#334F4F]"
                  target="_blank"
                >
                  Terms of Service & Privacy Policy
                </Link>
              </label>
            </div>
          )}

          <div className="w-full flex 2xl:mt-20 mt-10 justify-center lg:justify-start">
            <button
              disabled={isSubmiting || (!isLogin && !acceptedPolicy)}
              className={`flex xl:text-2xl text-xl items-center justify-center h-[50px] w-[30%]
    font-semibold rounded-2xl transition
    ${
      isSubmiting || (!isLogin && !acceptedPolicy)
        ? "bg-[#839b9b] cursor-not-allowed text-gray-600"
        : "bg-linear-to-r from-[#4DA19F] to-[#334F4F] text-white"
    }`}
            >
              {isSubmiting
                ? "Submitting..."
                : isLogin
                  ? "Log in"
                  : "Get started"}
            </button>
          </div>

          <p className="2xl:mt-15 mt-5">
            {isLogin ? (
              <>
                Don’t have an account?{" "}
                <Link
                  to="?mode=add_user"
                  className="text-[#4DA19F] cursor-pointer"
                >
                  Create one now
                </Link>
              </>
            ) : (
              <>
                Already got an account?{" "}
                <Link
                  to="?mode=login"
                  className="text-[#4DA19F] cursor-pointer"
                >
                  Sign in here
                </Link>
              </>
            )}
          </p>
        </Form>

        <div className="lg:flex hidden w-[40%] justify-center items-center overflow-hidden m-5 ">
          <img
            src={bodyImg2}
            className="w-full h-[70%]  rounded-2xl"
            alt="background"
          />
        </div>
      </section>
    </main>
  );
};

export default FinalForm;
