import Authentication, { action as authAction } from "./pages/Authentication";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import EducationPage from "./pages/EducationPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import ErrorPage from "./pages/ErrorPage";
import FinalForm from "./pages/FinalForm";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import HistoryPage from "./pages/HistoryPage";
import HomePage from "./pages/HomePage";
import ImageUploadPage from "./pages/ImageUploadPage";
import ProfilePage from "./pages/ProfilePage";
import ProtectedRoute from "./components/ProtectedRoute";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import RootLayout from "./pages/RootLayout";
import SignUpPage from "./pages/SignUpPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },

      { path: "FinalForm", element: <FinalForm /> },
      { path: "EmailVerificationPage", element: <EmailVerificationPage /> },
      { path: "auth", element: <Authentication />, action: authAction },
      { path: "contact", element: <Contact /> },
      { path: "AboutUs", element: <AboutUs /> },
      { path: "ForgotPassword", element: <ForgotPasswordPage /> },
      { path: "ResetPassword", element: <ResetPasswordPage /> },
      { path: "EducationPage", element: <EducationPage /> },

      // protected routes
      {
        element: <ProtectedRoute />,
        children: [
          { path: "ProfilePage", element: <ProfilePage /> },
          { path: "HistoryPage", element: <HistoryPage /> },
          { path: "UploadImage", element: <ImageUploadPage /> },
        ],
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
