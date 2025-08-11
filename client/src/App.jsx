// import React, { createContext, useState } from 'react';
// import { BrowserRouter, Route, Routes } from 'react-router-dom';
// import Home from './pages/Home';
// import Login from './pages/Login';
// import Verify from './pages/Verify';
// import Register from './pages/Register';
// import ForgotPassword from './pages/ForgotPassword';
// import toast, { Toaster } from 'react-hot-toast';

// // Create context
// export const MyContext = createContext();

// const App = () => {
//   const [isLogin, setIsLogin] = useState(false);
//   const [userData, setUserData] = useState(null);

//   // Simple alert box function
//   const openAlertBox = (status, msg) => {
//     if (status === 'success') toast.success(msg);
//     if (status === 'error') toast.error(msg);
//   };

//   // Values passed into context
//   const contextValues = {
//     isLogin,
//     setIsLogin,
//     userData,
//     setUserData,
//     openAlertBox
//   };

//   return (
//     <MyContext.Provider value={contextValues}>
//       <BrowserRouter>
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/verify" element={<Verify />} />
//           <Route path="/forgot-password" element={<ForgotPassword />} />
//           <Route path="/register" element={<Register />} />
//         </Routes>
//       </BrowserRouter>
//       <Toaster />
//     </MyContext.Provider>
//   );
// };

// export default App;


import React, { useEffect, useState } from 'react'
import Header from './components/Header'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
//import Footer from './components/Footer';
import { createContext } from 'react'


import Login from './pages/Login'
import Register from './pages/Register'
import Verify from './pages/Verify'


import toast, { Toaster } from 'react-hot-toast';
import ForgotPassword from './pages/ForgotPassword'
import { fetchDataFromApi } from './utils/api'



const MyContext = createContext();


function App() {

  const [isLogin, setIsLogin] = useState(false)
  const [userData, setUserData] = useState(null)

  

  // const toggleCartPanel = (newOpen) => () => {
  //   setOpenCartPanel(newOpen);
  // };

  useEffect(() => {

    const token = localStorage.getItem('accesstoken');

    if (token !== undefined && token !== null && token !== "") {
      setIsLogin(true)

      fetchDataFromApi("/api/user/user-details").then((res) => {

        setUserData(res.data);
      })
    } else {
      setIsLogin(false)
    }
  }, [isLogin])

  const openAlertBox = (status, meg) => {

    if (status === 'success') {
      toast.success(meg);
    }
    if (status === 'error') {
      toast.error(meg);
    }
  }

  const values = {
    openAlertBox,
    isLogin,
    setIsLogin,
    setUserData,
    userData
  }


  return (
    <div>
      <BrowserRouter>
        <MyContext.Provider value={values}>
      
          <Routes>
            <Route path={"/"} exact={true} element={<Home />} />
            <Route path={"/login"} exact={true} element={<Login />} />
            <Route path={"/register"} exact={true} element={<Register />} />
            <Route path={"/verify"} exact={true} element={<Verify />} />
            <Route path={"/forgot-password"} exact={true} element={<ForgotPassword />} />
           </Routes>
          {/* <Footer /> */}
        </MyContext.Provider>
      </BrowserRouter>

      <Toaster />

      



    </div>
  )
}

export default App

export { MyContext }