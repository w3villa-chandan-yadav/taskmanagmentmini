// import axios from "axios";

// const axiosInstance = axios.create({
//     baseURL: "http://localhost:3000",
//     withCredentials: true
// })

// let isRefreshing = false;

// let refreshSubscriber = [];

// const handleLogOut = ()=>{
//     if(window.location.pathname !== "/login"){
//         console.log("___))))____((((((____")
//         // window.location.href = "/login"
//     }
// }


// const subsCriberTokenRefresh = (callback)=>{
//     refreshSubscriber.push(callback)
// }


// //execute the queue 

// const onRefresh = ()=>{
//     refreshSubscriber.forEach((callback)=>{
//         callback()
//     });
//     refreshSubscriber= []
// }


// axiosInstance.interceptors.request.use(
//     (config)=> config,
//     (error)=> Promise.reject(error)
// )

// axiosInstance.interceptors.response.use(
//     (response)=> response,
//     async (error)=> {
//            const originalRequest = error.config;
//            //prevent infinity reload
           
//            if(error.response?.status === 401 && !originalRequest._retry){
//             if(isRefreshing){
//                 return new Promise((resolve)=>{
//                     subsCriberTokenRefresh(()=>resolve(axiosInstance(originalRequest)))
//                 })
//             }
//            }

//            originalRequest._retry = true
//            isRefreshing = true

//            try {
            
//             await axios.post("http://localhost:3000/api/refres_token",{},{withCredentials: true});

//             isRefreshing = false
 
//             onRefresh();

//             return axiosInstance(originalRequest)

//            } catch (error) {
            
//            }
//     }
// )



// export default axiosInstance