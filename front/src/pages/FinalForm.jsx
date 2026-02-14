import {
  Form,
  Link,
  useActionData,
  useNavigation,
  useSearchParams,
} from "react-router-dom";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

import bodyImg2 from "../assets/img/back.png";

const FinalForm = () => {
  const data = useActionData();
  const navigation = useNavigation();
  const isSubmiting = navigation.state === "submitting";
  const [acceptedPolicy, setAcceptedPolicy] = useState(false);
  const [searchParams] = useSearchParams();
  const isLogin = searchParams.get("mode") === "login";

  const [password, setPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState([]);

  const validatePassword = (pwd) => {
    const errors = [];
    if (pwd.length < 8) errors.push("Password must be at least 8 characters");
    if (!/[A-Z]/.test(pwd))
      errors.push("Password must contain an uppercase letter");
    if (!/[0-9]/.test(pwd)) errors.push("Password must contain a number");
    setPasswordErrors(errors);
  };

  useEffect(() => {
    if (!data) return;

    if (data.message) {
      toast.error(data.message, {
        style: { background: "#334F4F", color: "#fff", fontWeight: "bold" },
        duration: 4000,
      });
    }

    if (data.errors) {
      const errors = data.errors;

      if (Array.isArray(errors)) {
        errors.forEach((err) => {
          const msg = err.msg || JSON.stringify(err) || "Unknown error";
          toast.error(msg, {
            style: { background: "#334F4F", color: "#fff", fontWeight: "bold" },
            duration: 5000,
          });
        });
      } else if (typeof errors === "object") {
        Object.entries(errors).forEach(([field, errArr]) => {
          const arr = Array.isArray(errArr) ? errArr : [errArr];
          arr.forEach((err) => {
            const msg =
              typeof err === "string"
                ? err
                : err?.msg
                  ? `${field}: ${err.msg}`
                  : `${field}: ${JSON.stringify(err)}`;
            toast.error(msg, {
              style: {
                background: "#334F4F",
                color: "#fff",
                fontWeight: "bold",
              },
              duration: 5000,
            });
          });
        });
      } else {
        toast.error(String(errors), {
          style: { background: "#334F4F", color: "#fff", fontWeight: "bold" },
          duration: 5000,
        });
      }
    }
  }, [data]);

  return (
    <>
      <Toaster position="top-center" />
      <main className="flex items-center xl:justify-center bg-[#ABD3D2] w-full h-screen px-[5%] xl:px-[10%]">
        <section className="w-full mx-auto xl:h-[90%] h-[95%] bg-white flex flex-row px-[5%] 2xl:px-[10%]">
          <Form
            method="post"
            action={`/auth?mode=${isLogin ? "login" : "add_user"}`}
            className="lg:w-[60%] w-full flex flex-col justify-center items-center lg:items-stretch 2xl:py-20"
          >
            <h1 className="2xl:text-5xl text-3xl font-semibold 2xl:my-20 my-10 capitalize">
              {isLogin ? "Sign in" : "Sign up"}
            </h1>

            <div className="flex xl:flex-row flex-col gap-[5%] w-full">
              {!isLogin && (
                <div className="flex flex-col items-center lg:items-stretch 2xl:mt-0 xl:mt-5">
                  <label
                    htmlFor="name"
                    className="block xl:text-3xl text-2xl text-gray-700 mb-2"
                  >
                    Name
                  </label>
                  <input
                    required
                    type="text"
                    id="name"
                    name="first_name"
                    className="xl:w-full w-[70%] xl:h-12.5 h:[30px] border-3 border-[#E8E8E8] text-[#535353] bg-[#f8f8f8] xl:text-2xl text-xl rounded-2xl font-normal"
                  />
                </div>
              )}

              <div className="flex flex-col items-center lg:items-stretch 2xl:mt-0 xl:mt-5 mt-5">
                <label
                  htmlFor="email"
                  className="block xl:text-3xl text-2xl text-gray-700 mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  required
                  id="email"
                  data-testid="login-email"
                  name="email"
                  className="xl:w-full w-[70%] xl:h-12.5 h:[30px] border-3 border-[#E8E8E8] text-[#535353] bg-[#f8f8f8] xl:text-2xl text-xl rounded-2xl font-normal"
                />
              </div>
            </div>

            <div className="flex flex-col items-center lg:items-stretch 2xl:mt-10 xl:mt-5 mt-5 w-full">
              <label
                htmlFor="password"
                className="block xl:text-3xl text-2xl text-gray-700 mb-2"
              >
                Password
              </label>
              <input
                required
                type="password"
                id="password"
                data-testid="login-password"
                name="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (!isLogin) validatePassword(e.target.value);
                }}
                className="xl:w-full w-[70%] xl:max-w-[278px] xl:h-12.5 h:[30px] border-3 border-[#E8E8E8] text-[#535353] bg-[#f8f8f8] text-2xl rounded-2xl font-normal"
              />

              {!isLogin && passwordErrors.length > 0 && (
                <ul className="text-[#333333] mt-1 list-disc list-inside text-sm">
                  {passwordErrors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              )}

              {isLogin && (
                <p>
                  Forgot password?{" "}
                  <Link
                    to="/ForgotPassword"
                    className="text-[#4DA19F] cursor-pointer"
                  >
                    Click here
                  </Link>
                </p>
              )}
            </div>

            {!isLogin && (
              <div className="mt-6 flex items-start gap-3 max-w-[600px]">
                <input
                  required
                  type="checkbox"
                  id="accept_policy"
                  name="accept_policy"
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
                data-testid="login-submit"
                disabled={
                  isSubmiting ||
                  (!isLogin && (!acceptedPolicy || passwordErrors.length > 0))
                }
                className={`flex xl:text-2xl text-xl items-center justify-center xl:h-[50px] h-[35px] w-[40%]
                  font-semibold rounded-2xl transition
                  ${
                    isSubmiting ||
                    (!isLogin && (!acceptedPolicy || passwordErrors.length > 0))
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

            <p className="2xl:mt-15 mt-5 pb-5">
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
              className="w-full h-[70%] rounded-2xl"
              alt="background"
            />
          </div>
        </section>
      </main>
    </>
  );
};

export default FinalForm;
