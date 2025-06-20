import { useEffect, useState } from 'react'
import FloatingShape from './components/FloatingShape'
import { Route, Routes } from 'react-router-dom'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import Analysis from './pages/Analysis'
import { useAuthStore } from './store/authStore'
import Dashboard from './pages/Dashboard'
import { Navigate } from 'react-router-dom'
import LoadingSpinner from './components/LoadingSpinner'
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) {
    return <LoadingSpinner />; // albo null, żeby nie renderować jeszcze routingu
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) {
    return <LoadingSpinner />;
  }

  if (isAuthenticated && user) {
    return <Navigate to="/" replace />;
  }

  return children;
};
function App() {
  const {isCheckingAuth,checkAuth,isAuthenticated,user} = useAuthStore()

useEffect(() => {
  checkAuth();
}, [checkAuth]);

  if (isCheckingAuth) return <LoadingSpinner/>

  console.log("isAuthenticated",isAuthenticated)
  console.log("user",user)
  return (
    <>
      <div className='min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center relative overflow-hidden'>
        <FloatingShape color="bg-green-500" size="w-64 h-64" top="-5%" left="10%" delay={0}/>
        <FloatingShape color="bg-emerald-500" size="w-48 h-48" top="70%" left="80%" delay={5}/>
        <FloatingShape color="bg-lime-500" size="w-32 h-32" top="40%" left="-10%" delay={2}/>

        <Routes>
          <Route path="/" element={<ProtectedRoute><Dashboard/></ProtectedRoute>}></Route>
          <Route path="/signup" element={<RedirectAuthenticatedUser><SignUpPage/></RedirectAuthenticatedUser>}></Route>
          <Route path="/login" element={<LoginPage/>}></Route>
          <Route path='/analysis' element={<Analysis/>}></Route>
        </Routes>
      </div>
    </>
  )
}

export default App
