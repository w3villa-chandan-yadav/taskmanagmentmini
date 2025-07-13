import React from 'react'
import logoImage from "../assets/project-management.png";
import { PiGridFourFill } from "react-icons/pi";
import { FaCopy } from "react-icons/fa";
import { MdMarkUnreadChatAlt } from "react-icons/md";
import { FaBell } from "react-icons/fa";
import { IoExitOutline } from "react-icons/io5";
import { FaQuestionCircle } from "react-icons/fa";
import { SiSpacemacs } from "react-icons/si";
import { useDispatch, useSelector } from 'react-redux';
import { logOut } from '../redux/slices/userSlice';
import { TbPremiumRights } from "react-icons/tb";
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useTaskContect } from '../contextApi/TaskContext';
import { CgProfile } from "react-icons/cg";
import { useLocation } from 'react-router-dom';











const SideBar = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
       const location = useLocation();
    
  const { userDetails } = useSelector((state) => state.user);
    const { notification, setNotifications }  = useTaskContect()
  

    // const {userDetails } = useSelector((state)=>state.user)
    // const fetchPayment = async ()=>{
    //     try {
    //         const data = await fetch("http://localhost:4000/payment/v1/createPayment",{
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json"
    //             }
    //         })
    //         const result = await data.json();

    //         console.log(result)

    //         const options ={
    //             key: "rzp_test_DWYqJIt4IyNzn8",
    //             amount: result?.data?.amount,
    //             currency: result?.data?.currency,
    //             name: result?.data?.name,
    //             description: "Test Transaction",
    //             order_id: result?.data?.id,
    //             handler: async (response)=>{
                    
    //                 console.log(response)

    //                   const data = await fetch("http://localhost:4000/payment/v1/verify",{
    //                     method: "POST",
    //                     headers:{
    //                         "Content-Type": "application/json"
    //                     },
    //                     body : JSON.stringify( {
    //                         razorpay_order_id: response.razorpay_order_id,
    //                         razorpay_payment_id: response.razorpay_payment_id,
    //                         razorpay_signature: response.razorpay_signature,
    //                       })
    //                   })

    //                   const result = await data.json();

    //                   console.log(result)
    //             }
    //         }

    //         const rzp = new Razorpay(options)

    //         rzp.open()
            
    //     } catch (error) {
    //         console.log("error in the fetchPayment")
    //     }
    // }


 const unreadedCount = async () => {
    try {
      const totalUnreaded =  await fetch(`http://localhost:4000/api/v1/notification/unreadedCount`, {
        method: "GET",
        headers: {
          Authorization: userDetails?.token,
        },
      });

      const result =  await totalUnreaded.json()

      setNotifications(result?.nureadedMessage || 0)

    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  useEffect(()=>{
  unreadedCount()
  },[])




  return (
    <div className='flex flex-col justify-between h-full items-center p-2'>
        <div className='flex flex-col gap-10'>
        <div>
         {/* <img src={logoImage} className='w-12 bg-white rounded-xl text-white'/> */}
         <SiSpacemacs className='text-white text-3xl'/>
        </div>
        <div className='flex flex-col gap-2'>
            {/* onClick={fetchPayment}  location.pathname === '/projects'*/}

          <Link to='/'>  <div  className={`relative text-center hover:bg-gray-600 ${location.pathname === "/" && "bg-gray-600"} rounded-sm cursor-pointer group`}>
              <span className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all z-50 whitespace-nowrap">
                    Dashboard
                    </span>
              <PiGridFourFill className={`text-3xl mx-auto group-hover:text-white  ${location.pathname === "/" && "text-white" }  text-gray-500 transition-all duration-150`}/>
            </div></Link>
           <Link to={'/profile'}> <div className={`relative text-center hover:bg-gray-600  ${location.pathname === "/profile" && "bg-gray-600"} rounded-sm cursor-pointer px-2 py-1 group `}>
                          <span className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all z-50 whitespace-nowrap">
                                profile
                                </span>
                <CgProfile  className={`text-2xl mx-auto group-hover:text-white text-gray-500  ${location.pathname === "/profile" && "text-white"} transition-all duration-150`}/> 
            </div></Link>
           <Link to={"/projects"}>  <div className={`relative text-center hover:bg-gray-600 ${location.pathname === "/projects" && "bg-gray-600"} rounded-sm cursor-pointer px-2 py-1 group`}>
                        <span className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all z-50 whitespace-nowrap">
                        projects
                        </span>
               <FaCopy  className={`text-2xl mx-auto group-hover:text-white text-gray-500 ${location.pathname === "/projects" && "text-white"} transition-all duration-150`}/>
            </div></Link>
           <Link to="/payment"> <div className={`relative text-center hover:bg-gray-600 ${location.pathname === "/payment" && "bg-gray-600"} rounded-sm cursor-pointer px-2 py-1 group`}>
                       <span className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all z-50 whitespace-nowrap">
                        Payment
                        </span>
              <TbPremiumRights  className={`text-2xl mx-auto group-hover:text-white text-gray-500  ${location.pathname === "/payment" && "text-white"} transition-all duration-150`}/> 
            </div></Link>
            <Link to="/notification">
                <div className={`relative text-center hover:bg-gray-600 ${location.pathname === "/notification" && "bg-gray-600"} rounded-sm cursor-pointer px-2 py-1 group`}>
                            <span className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all z-50 whitespace-nowrap">
                            notification
                            </span>

                    <FaBell className={`text-2xl mx-auto group-hover:text-white ${location.pathname === "/notification" && "text-white"} text-gray-500 transition-all duration-150`} />
                    
                    {notification > 0 && (
                    <div className="absolute top-[2px] right-1 bg-red-600 text-[9px] text-white font-bold w-3 h-3 rounded-full flex items-center justify-center animate-ping-once">
                        {notification}
                    </div>
                    )}
                </div>
    </Link>
        </div>
        </div>
        <div className=' flex flex-col gap-3'>
        <div 
         onClick={()=>{sessionStorage.removeItem("user");
            dispatch(logOut());
            navigate("/login")
        }}
        className='relative text-center hover:bg-gray-600 rounded-sm cursor-pointer px-2 py-1 group '>
             <span className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all z-50 whitespace-nowrap">
                        Logout
                        </span>
        <IoExitOutline 
        className=' text-2xl mx-auto group-hover:text-white text-gray-500  transition-all duration-150'/>
            </div>
        <div className='relative text-center hover:bg-gray-600 rounded-sm cursor-pointer px-2 py-1 group '>
               <span className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all z-50 whitespace-nowrap">
                        Comming Soon
                        </span>
            <FaQuestionCircle  className='text-2xl mx-auto group-hover:text-white text-gray-500 drop-shadow-2xl drop-shadow-black  transition-all duration-150'/>
        </div>
        </div>
    </div>
  )
}

export default SideBar