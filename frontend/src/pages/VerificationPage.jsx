import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

const VerificationPage = () => {
    const navigate = useNavigate()
    const [verifing, setVerfing] = useState(false)
    const { token } = useParams();
   
    const handleverification = async ()=>{
        try {
            const data = await fetch("http://localhost:4000/api/v1/user/verification",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({token})
            })

            const result = await data.json()

            // console.log(result)

            if(result.success){
                navigate("/login")
            }
            else{
                alert(result.message);
                navigate("/signup")
                
        }
            
        } catch (error) {
            console.log("there is an error in the verifing section token")
        }
    }

    useEffect(()=>{
    //   console.log(token )
      handleverification()
    },[])
  return (
    <div className='w-screen h-screen grid place-items-center bg-[#121315]'>
     <div className=''>
         {
            verifing ? <p className='text-center text-xl anton text-white'>You Are Verifyed <br/><Link>Login</Link> </p> : <p className='anton text-xl text-white leading-tight'> verifynig....</p>
         }
     </div>
    </div>
  )
}

export default VerificationPage