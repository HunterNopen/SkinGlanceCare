import Authentication, { action as authAction } from './pages/Authentication';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import ErrorPage from './pages/ErrorPage';
import FinalForm from './pages/FinalForm';
import HomePage from './pages/HomePage';
import ImageUploadPage from './pages/ImageUploadPage';
import RootLayout from './pages/RootLayout';
import SignUpPage from './pages/SignUpPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,      // tu mamy nasz layout z nawigacją
    errorElement: <ErrorPage />,  // opcjonalnie
    children: [
      { index: true, element: <HomePage /> },
      { path: 'FinalForm', element: <FinalForm />, action: authAction },
      // { path: 'SignUp', element: <SignUpPage /> },
      { path: 'UploadImage',element: <ImageUploadPage/>},
      { path: 'auth', element: <Authentication />, action: authAction },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
