import React, { useEffect, useState } from 'react'
import image from "../assets/mesh.avif"
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { addUserLogin } from '../redux/slices/userSlice'
import { toast } from 'react-toastify'
import LoginGoogle from '../utils/LogwithGoogle'

const SignUp = () => {
    const navigate = useNavigate()
    const  dispatch = useDispatch()
    const { userDetails } = useSelector((state)=>state.user)


    const [ email , setEmail ] = useState("");
    const [password, setpassword ] = useState("")

    const handleSubmit =async (e)=>{
            e.preventDefault();
        try {
            // console.log("called")
            const data = await fetch("https://taskmanagmentmini.onrender.com/api/v1/user/login",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({email,password}),
                // credentials: "include",
            })

            const result = await data.json();

            // console.log(result.data[0])
  
            if(result.success){
            sessionStorage.setItem("user", JSON.stringify(result.data[0]))
            dispatch(addUserLogin(result.data[0]))
            navigate("/")
            toast.success("Login successfully")
            }else{
                toast.error(result.message)
            }
            

        } catch (error) {
            console.log("error in handleSubmit frontend")
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
     <div  
      className=' border-[1px] border-white/40 h-auto rounded-sm p-3 flex flex-col gap-3 lg:w-[40%] bg-linear-to-t from-black/80 to-black/20 md:w-[50%] sm:w-[55%]'>
      <div className='w-full '>
        <p className='text-center anton text-white'>Welcome Back</p>
        </div>
          <div className='w-full '>
       <div className='flex items-center justify-center'><LoginGoogle/></div> 
       <div className='flex items-center justify-between'>
        <div className='h-[1px] w-full bg-white'/>
        <p className='text-white text-[9px] text-nowrap mx-2'>Or Manually</p>
        <div className='h-[1px] w-full bg-white'/>
        


       </div>
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
           onChange={(e)=>setpassword(e.target.value)}
          type='password'
          className=' border-white/20 border-[1px] px-1 py-2  text-white outline-none rounded-sm w-full'
          placeholder='*******'
          />
        
          </div> 

          <div className='flex justify-center items-center gap-3'>
          <button
          type='submit'
                onSubmit={handleSubmit}
          className=' border-white/20 border-[1px] px-1 py-2 bg-green-500/40 cursor-pointer text-white outline-none rounded-sm w-full'
          >
          Login
          </button>
       
          </div> 

          <div className='flex justify-center items-center gap-3 text-white anton px-3'>
          <p className='text-[10px] leading-tight'>Don't have account?</p>
          <Link to="/signup" className='text-[10px] leading-tight text-red-500 cursor-pointer'>SignUp</Link>
          </div> 





        
          
     </div>

    </div>
  )
}

export default SignUp