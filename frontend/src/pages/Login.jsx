import React, { useEffect, useState } from 'react'
import image from "../assets/mesh.avif"
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import LogwithGoogle from '../utils/LogwithGoogle'

const Login = () => {
  const navigate =useNavigate()
  const { userDetails } = useSelector((state)=>state.user);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword ,setConfirmPassword] = useState("")

  const handleSubmite = async(e)=>{

    e.preventDefault();
    // console.log("here i am")
    // console.log(password , confirmPassword, password.trim().length)
 
    if( password.trim().length < 1  || password != confirmPassword ){
      alert("Password Must be same")
      return 
    }

    try {
      

      const data = await fetch("http://localhost:4000/api/v1/user/register",{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({name, email, password}),
      })


//       const response = await axios.post(
//   'http://localhost:4000/api/v1/user/register',
//   {
//     name,
//     email,
//     password
//   },
//   {
//     withCredentials: true,
//     headers: {
//       Authorization: `Bearer ${token}`,
//       'Content-Type': 'application/json'
//     }
//   }
// );

      const result = await data.json();

      if(result.success){
        toast.success("please check your email")
      }else{
        result.message
      }

      setName("")
      setPassword("")
      setEmail("")
      setConfirmPassword("")

    } catch (error) {
      console.log("there is error in hanleSubmite in Login Component")
    }
  }

  useEffect(()=>{
     if(userDetails){
      navigate("/")
     }
  },[])


  return (
    <div
    style={{ backgroundImage: `url(${image})` }}
    className='w-screen h-screen  bg-no-repeat object-cover bg-cover bg-center imageAnimation grid place-items-center px-4'>



     <form onSubmit={handleSubmite} className=' border-[1px] border-white/40 h-auto rounded-sm p-3 flex flex-col gap-3 lg:w-[40%] bg-linear-to-t from-black/80 to-black/20 md:w-[50%] sm:w-[55%]'>
      <div className='w-full '>
        <p className='text-center anton text-white'>Create Account</p>
       <div className='flex items-center justify-center'><LogwithGoogle/></div> 
       <div className='flex items-center justify-between'>
        <div className='h-[1px] w-full bg-white'/>
        <p className='text-white text-[9px] text-nowrap mx-2'>Or Manually</p>
        <div className='h-[1px] w-full bg-white'/> 
       </div>
        </div>
         <div className='w-full '>
          <input
          value={name}
          onChange={(e)=>setName(e.target.value)}
          type='Name'
          className=' border-white/30 border-[1px] px-1 py-2   text-white outline-none rounded-sm w-full'
          placeholder='Please enter your Name'
          
          />
          </div> 

          <div>
          <input
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          type='email'
          className=' border-white/20 border-[1px] px-1 py-2  text-white outline-none rounded-sm w-full'
          placeholder='Please enter your Email'
          />
          </div> 
          <div className='flex justify-center items-center gap-3'>
          <input
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          type='password'
          className=' border-white/20 border-[1px] px-1 py-2  text-white outline-none rounded-sm w-full'
          placeholder='*******'
          />
          <input
          value={confirmPassword}
          onChange={(e)=>setConfirmPassword(e.target.value)}
          type='password'
          className=' border-white/20 border-[1px] px-1 py-2  text-white outline-none rounded-sm w-full'
          placeholder='Confirm Password'
          />
          </div> 

          <div className='flex justify-center items-center gap-3'>
          <button
          type='submit'
          className=' border-white/20 border-[1px] px-1 py-2 bg-green-500/40 cursor-pointer text-white outline-none rounded-sm w-full'
          >
          Create
          </button>
       
          </div> 

          <div className='flex justify-center items-center gap-3 text-white anton px-3'>
          <p className='text-[10px] leading-tight'>Already have account?</p>
          <Link to="/login" className='text-[10px] leading-tight text-red-500  cursor-pointer'>Login</Link>
          </div> 





        
          
     </form>

    </div>
  )
}

export default Login