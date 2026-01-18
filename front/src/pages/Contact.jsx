import React from "react";

const Contact = () => {
  return (
    <div className="flex flex-col lg:flex-row p-6 lg:p-10 gap-10">
      <section className="flex flex-1 flex-col items-center  justify-center text-center ">
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold">
          Get in touch with us
        </h2>
        <p className="text-xl sm:text-2xl lg:text-3xl mt-6 lg:mt-10">
          Have a question? <br />
          Fill out the form below, and our team will <br /> get back to you as
          soon as possible.
        </p>
      </section>

      <section className="flex flex-1 flex-col items-center lg:items-start justify-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold">
          Contact Us
        </h1>

        <form className="flex flex-col w-full max-w-[600px] mt-6 lg:mt-10">
          <label className="text-lg sm:text-xl mt-6 mb-2" htmlFor="email">
            Email
          </label>
          <input
            placeholder="email"
            type="email"
            name="email"
            className="w-full h-12 sm:h-14 border border-[#E8E8E8] 
                       text-[#535353] bg-[#f8f8f8] text-lg sm:text-2xl rounded-2xl font-normal p-3"
          />

          <label className="text-lg sm:text-xl mt-6 mb-2" htmlFor="help">
            How can We help You?
          </label>
          <textarea
            placeholder="Enter your message"
            className="w-full h-40 sm:h-52 border border-[#E8E8E8] 
                       text-[#535353] bg-[#f8f8f8] text-lg sm:text-2xl rounded-2xl font-normal p-3 resize-none"
            name="help"
          />

          <div className="w-full flex justify-center lg:justify-start mt-6 sm:mt-10">
            <button
              type="submit"
              className="flex items-center justify-center text-lg sm:text-xl xl:text-2xl h-12 sm:h-14 w-full sm:w-[40%] bg-linear-to-r from-[#4DA19F] to-[#334F4F] text-white font-semibold rounded-2xl"
            >
              Send message
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default Contact;
