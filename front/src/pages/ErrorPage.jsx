import React from "react";
import { useRouteError } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError();

  let title = "Wystąpił nieznany błąd!";
  let message = "Coś poszło nie tak po stronie aplikacji.";

  if (error && error.status) {
    title = `Błąd ${error.status}`;
    message = error.statusText || "Nie znaleziono strony.";
  }

  if (error && error.message) {
    message = error.message;
  }

  return (
    <main className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-9xl bg-linear-to-r from-[#4DA19F] to-[#334F4F] bg-clip-text text-transparent font-bold">
          {title}
        </h1>
        <p className="text-4xl mt-8">{message}</p>
        <p className="mt-10 text-4xl text-gray-500">
          Try came back to{" "}
          <a href="/" className="text-blue-500 hover:underline">
            Home Page
          </a>
        </p>
      </div>
    </main>
  );
};

export default ErrorPage;
