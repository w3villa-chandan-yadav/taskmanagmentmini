import React,{useState} from 'react'
import {useGoogleLogin,GoogleOAuthProvider} from "@react-oauth/google"
import { FcGoogle } from "react-icons/fc";
import { addUserLogin } from '../redux/slices/userSlice';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';



const Loing = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate()

    const responseGoogle =async (authResult)=>{

        try {
            if(authResult["code"]){
                console.log("data fetching")

                const data = await fetch(`http://localhost:4000/api/v1/googleLogin?code=${authResult["code"]}`) ;
                console.log(data)

                const result =await data.json();

                console.log(result, 'reultjifnkdf')
                 if(result.success){
                            sessionStorage.setItem("user", JSON.stringify(result.data[0]))
                            dispatch(addUserLogin(result.data[0]))
                            navigate("/")
                            toast.success("Login successfully")
                            }else{
                                toast.error(result.message)
                            }
            }
        //   console.log(authResult["code"])
        } catch (error) {
          console.log(`error  while requiesting code ${error}`)
        }
    
      }
    
    
      const googleLogin= useGoogleLogin({
        onSuccess:responseGoogle,
        onError:responseGoogle,
    
        flow:'auth-code'
      })
      const buttonStylesGoogle = {
        width: '100%',
        padding: '10px',
        margin:"10px 0px",
        backgroundColor: 'blue',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        display: 'flex',
        gap:'7px',
        
      };
      const handleMouseOver = (e) => {
        e.target.style.backgroundColor = buttonHoverStyles.backgroundColor;
      };
    
      const handleMouseOut = (e) => {
        e.target.style.backgroundColor = buttonStyles.backgroundColor;
      };
    


  return (<>

  
  <div >
      <div >
        
          <button 
          style={buttonStylesGoogle}
          className='items-center'
          onClick={googleLogin}>
          <FcGoogle/> Google Login
      </button>
      </div>
    </div>
  
  </> )
}

 const LoginGoogle =()=>{
    return(
      <GoogleOAuthProvider clientId="181245531875-quhabvaodrjq1kcchmde90ltd1rqj91s.apps.googleusercontent.com">
      <Loing/>
    </GoogleOAuthProvider>
    )
  }

  export default LoginGoogle