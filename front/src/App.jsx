import Authentication, { action as authAction } from "./pages/Authentication";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import ErrorPage from "./pages/ErrorPage";
import FinalForm from "./pages/FinalForm";
import HistoryPage from "./pages/HistoryPage";
import HomePage from "./pages/HomePage";
import ImageUploadPage from "./pages/ImageUploadPage";
import Navbar from "../src/components/Navbar";
import ProfilePage from "./pages/ProfilePage";
import ProtectedRoute from "./components/ProtectedRoute";
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
      { path: "UploadImage", element: <ImageUploadPage /> },
      { path: "EmailVerificationPage", element: <EmailVerificationPage /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: "ProfilePage", element: <ProfilePage /> },
          { path: "HistoryPage", element: <HistoryPage /> },
        ],
      },
      { path: "auth", element: <Authentication />, action: authAction },
      { path: "contact", element: <Contact /> },
      { path: "AboutUs", element: <AboutUs /> },
      { path: "ProfilePage", element: <ProfilePage /> },
      { path: "HistoryPage", element: <HistoryPage /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
