import FinalForm from "./FinalForm.jsx";
import React from "react";
import { redirect } from "react-router-dom";

function Authentication() {
  return <FinalForm />;
}

export default Authentication;

export async function action({ request }) {
  const searchParams = new URL(request.url).searchParams;
  const mode = searchParams.get("mode") || "login";

  if (mode !== "login" && mode !== "add_user") {
    throw new Response(JSON.stringify({ message: "unexpected mode" }), {
      status: 422,
      headers: { "Content-Type": "application/json" },
    });
  }

  const data = await request.formData();

  if (mode === "login") {
    const formData = new URLSearchParams();
    formData.append("username", data.get("email"));
    formData.append("password", data.get("password"));

    const response = await fetch(`http://localhost:8000/access/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString(),
    });

    const resData = await response.json();

    if (!response.ok) {
      return { errors: resData.detail ? [resData.detail] : ["Unknown error"] };
    }
    const name = resData.user?.name || "";
    console.log(name);

    localStorage.setItem("token", resData.access_token);

    localStorage.setItem("userName", name);

    return redirect("/");
  }

  if (mode === "add_user") {
    const authData = {
      email: data.get("email"),
      password: data.get("password"),
      name: data.get("first_name"),
      rodo_accepted: data.get("accept_policy") === "on",
    };

    const response = await fetch(`http://localhost:8000/access/signup/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(authData),
    });

    const resData = await response.json();

    if (!response.ok) {
      return { errors: resData.detail ? [resData.detail] : ["Unknown error"] };
    }

    localStorage.setItem("token", resData.access_token);
    localStorage.setItem("signup_email", data.get("email"));

    return redirect("/EmailVerificationPage");
  }
}
