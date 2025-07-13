import React, { useEffect } from 'react'
import "./App.css"
import { Route, Routes } from 'react-router-dom'
import { FrontPage, HomePage } from './pages'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import VerificationPage from './pages/VerificationPage'
import { TaskContextProvider } from './contextApi/TaskContext'
import  PaymentPage  from './pages/PaymentPage'
import Dashboard from './pages/DashBoard'
import NotificationSection from './pages/Notification'
import socket from './utils/socket'
import { useSelector } from 'react-redux'
import ProfilePage from './pages/Profilepage'

const App = () => {
  const { userDetails } = useSelector((state)=> state.user);

  // console.log(React.version)
// useEffect(() => {
//   if (userDetails) {
//     console.log("✅ Connecting socket for user:", userDetails.id);
//     socket.connect();

//     socket.on("connect", () => {
//       console.log("🔗 Socket connected!");
//       socket.emit("join", userDetails.id);
//     });

//     return () => {
//       socket.disconnect();
//     };
//   }
// }, [userDetails]);


useEffect(() => {
  if (userDetails) {
    if (!socket.connected) {
      // console.log("✅ Connecting socket for user:", userDetails.id);
      socket.connect();
    }

    const onConnect = () => {
      // console.log("🔗 Socket connected!");
      socket.emit("join", userDetails.id);
    };

    socket.on("connect", onConnect);

    return () => {
      socket.off("connect", onConnect);
      socket.disconnect();
    };
  }
}, [userDetails]);


// useEffect(() => {
//   socket.on("new_invite", (data) => {
//     console.log("📬 Received new_invite:", data);
//     // setNotifications((prev) => [
//     //   {
//     //     type: "invite",
//     //     icon: <FaUserPlus className="text-yellow-400" />,
//     //     message: data.message,
//     //     time: "just now",
//     //   },
//     //   ...prev,
//     // ]);
//   });

//   return () => {
//     socket.off("new_invite");
//   };
// }, []);


  return (
    <TaskContextProvider>

    <Routes>
      
      <Route exact path='/' element ={<HomePage/>}>
      <Route index element= {<Dashboard/>}/>
      <Route path="/projects" element= {<FrontPage/>}/>
      <Route path='/payment' element={<PaymentPage/>}/>
      <Route path='/notification' element={<NotificationSection/>}/>
      <Route path='/profile' element={<ProfilePage/>}/>
      </Route>
      <Route path='/login' element={<SignUp/> }/>
      <Route path ="/signup" element= {<Login/>}/>
      <Route path= "/verification/:token" element= {<VerificationPage/>}/>
    </Routes>
    </TaskContextProvider>
  )
}

export default App


