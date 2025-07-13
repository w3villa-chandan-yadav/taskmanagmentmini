import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userDetails : sessionStorage.getItem("user") ? JSON.parse(sessionStorage.getItem("user")) : null,
}



const userSlice = createSlice({
    name: "userSlice",
    initialState: initialState,
    reducers: {
        addUserLogin: (state, action)=>{
              state.userDetails = action.payload
        } ,
        logOut: (state)=>{
            state.userDetails = null
        }
    }
})

export const  { addUserLogin, logOut } = userSlice.actions ;

export default userSlice.reducer ;