import React, { useEffect, useState } from "react";
import { getToken, getUserId } from "../util/auth";

import ConfirmModal from "../components/ConfirmModal";
import { deleteAccount } from "../util/deleteAcount";
import { getMe } from "../api/user";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/auth";
  };

  const handleChange = () => {
    navigate("/ForgotPassword");
  };

  async function handleConfirmDelete() {
    try {
      await deleteAccount();
      navigate("/");
    } catch (err) {
      alert(err.message);
    }
  }

  useEffect(() => {
    getMe()
      .then((data) => setUser(data))
      .catch((err) => console.error(err));
  }, []);

  const inputClasses =
    "w-full md:w-[70%] h-[50px] border-3 border-[#E8E8E8] text-[#535353] bg-[#f8f8f8] text-2xl rounded-2xl font-normal p-2";

  if (!user) return <p>Loading...</p>;

  return (
    <section className="w-full bg-[#ABD3D2] flex justify-center items-start py-20 px-4 md:py-[77px]">
      <div className="bg-white w-full max-w-[600px] md:h-[600px] flex flex-col rounded-2xl p-6 md:p-8 justify-between">
        <div className="flex flex-col">
          <h1 className="text-3xl md:text-4xl text-center font-semibold mt-2 text-[#334F4F]">
            Your Profile
          </h1>
          <form className="flex flex-col items-center mt-8 gap-4 md:gap-6 w-full">
            <div className="flex flex-col w-full items-center">
              <label className="w-full md:w-[70%] text-left text-xl font-semibold mb-1">
                Name
              </label>
              <input
                type="text"
                value={user.name}
                disabled
                className={inputClasses}
              />
            </div>

            <div className="flex flex-col w-full items-center">
              <label className="w-full md:w-[70%] text-left text-xl font-semibold mb-1">
                Email
              </label>
              <input
                type="text"
                value={user.email}
                disabled
                className={inputClasses}
              />
            </div>

            <div className="flex flex-col w-full items-center">
              <label className="w-full md:w-[70%] text-left text-xl font-semibold mb-1">
                Password
              </label>
              <div className="w-full md:w-[70%] flex flex-col sm:flex-row items-center gap-2">
                <input
                  type="password"
                  value="********"
                  readOnly
                  className={`${inputClasses} flex-1`}
                />
                <button
                  type="button"
                  className="w-full sm:w-auto px-4 py-2 text-gray-600 hover:text-gray-800 rounded-2xl font-semibold mt-2 sm:mt-0"
                  onClick={handleChange}
                >
                  Change
                </button>
              </div>
            </div>
          </form>
        </div>

        <div className="mt-6 md:mt-10 flex flex-col sm:flex-row gap-4 sm:gap-5 w-full items-center justify-center">
          <button
            className="w-full sm:w-auto text-[#4DA19F] hover:text-[#47b9a3] font-semibold"
            onClick={handleLogout}
          >
            Logout
          </button>

          <button
            className="w-full sm:w-auto text-red-900 hover:text-red-600 font-semibold"
            onClick={() => setOpen(true)}
          >
            Delete Account
          </button>

          {open && (
            <ConfirmModal
              title="Delete account?"
              description="This action cannot be undone."
              confirmText="Delete account"
              cancelText="Cancel"
              onCancel={() => setOpen(false)}
              onConfirm={handleConfirmDelete}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;
