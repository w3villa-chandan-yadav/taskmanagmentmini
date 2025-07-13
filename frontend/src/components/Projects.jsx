import React, { useEffect, useState } from 'react'
import { IoAdd } from 'react-icons/io5';
import { RiSearch2Line } from "react-icons/ri";
import { FaRegClock } from "react-icons/fa6";
import { useSelector } from 'react-redux';
import { useTaskContect } from '../contextApi/TaskContext';
import { MdGroups3 } from "react-icons/md";
import { toast } from 'react-toastify';






const Projects = ({handleTaskCreation}) => {
   const { userDetails } = useSelector((state)=>state.user);
   const { isGroup , setIsGruop,setTasks, setTeamm, teamm , recent, setRecent, setCurrentGroup, currentGroup} = useTaskContect()
   // console.log(isGroup)

    const handleTypes = (type)=>{
      console.log(type)
      if(userDetails.tier === "normal"){ 
          toast.info("Please buy premium")
          return
      }
      if(type === "team"){
        setIsGruop(true)
      }else{

        setIsGruop(false)
        setCurrentGroup(null)
      }
    }

    // console.log(teamm)

    useEffect(()=>{
      // console.log(userDetails.token);
      // console.log(isGroup);


      (async ()=>{
        const  data = await fetch(`https://taskmanagmentmini.onrender.com/api/v1/task/getAllTask?groupId=${isGroup}`,{
          method: "GET",
          headers: {
            "Content-Type":"application/json",
            Authorization: userDetails.token, 
          }
        });
        const result = await data.json();
 
        // console.log(result);

        if(isGroup){
          setTeamm(result.data) 
          setCurrentGroup(result?.data[0]?.id)
          setRecent([])
        }else{
          setRecent(result.data)
        }
   
         if(!isGroup){
          setTasks(result.data)
         }else{

          const recentdata = await fetch("https://taskmanagmentmini.onrender.com/api/v1/task/getGroupTask",{
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: userDetails.token
            },
          })

          const data = await recentdata.json()

          setRecent(data.data)

         }


      })()

    },[isGroup])



    const groupTasks = async ()=>{
      try {

        // console.log(currentGroup)
        // console.log("-=0-0-=--0-0=-0")

        const data = await fetch(`https://taskmanagmentmini.onrender.com/api/v1/task/getSingleGroupTask/${currentGroup}`,{
          method: "GET",
          headers: {
            "Content-Type":"application/json",
            Authorization: userDetails.token
          }
        })

        const result = await data.json();

        // console.log(result)
        setTasks(result.data)
        
      } catch (error) {
        console.log("error in the groupTask to fetch the specific group task")
      }
    }



    useEffect(()=>{

      // console.log(currentGroup)

      if(!currentGroup){
        return
      }
      // console.log("heeehehehehehhe---------------------------------heheheheheh")

       groupTasks()


    },[currentGroup])

    // console.log(recent)
    // console.log(isGroup)

  return (
   <div className='flex flex-col justify-between w-full h-full gap-2 p-3 '>
     <div className='w-full h-full  border-b-[1px] pb-3 border-gray-500  hiddeScrollBar overflow-y-scroll'>
      <h2 className='anton text-white mb-6'>Projects</h2>
      <div className='mx-auto flex justify-center text-white  p-1 bg-[#121315] rounded-sm w-[90%] '>
         <button 
         //  ${userDetails?.tier === "normal" ? "pointer-events-none":""}
         onClick={()=>{
          handleTypes("team")}}
         className={`${isGroup ? "bg-[#282c32] shadow-xs/40 shadow-gray-300" : ""} cursor-pointer flex-1 font-bold py-2 text-[12px] rounded-sm`}>
            Team
         </button>
         <button
       onClick={()=>{
        handleTypes("personal")}}
         className={`${isGroup ? "" : "bg-[#282c32] shadow-xs/40 shadow-gray-300"} cursor-pointer flex-1 font-bold py-2  rounded-sm  text-[12px] `}>
            Personal
         </button>
      </div>
      <div className='w-[90%] rounded-sm bg-[#121315] mx-auto mt-6 flex items-center gap-2 px-1 '>
        <RiSearch2Line className='text-white text-[45px]'/> 
        <input
        className='text-gray-200 py-2 text-[13px] outline-none'
        placeholder='Search....'
        type='text'
        />

      </div>

      {isGroup && <div className='w-[90%] mx-auto mt-6  '>
          <p className='flex justify-start items-center gap-4 text-[14px] text-white/60'> <MdGroups3 className='text-md'/>Groups</p>
         <div className=''>
          {
          teamm.map((ele)=>{
              return (
                <div key={ele.id} 
                onClick={()=>setCurrentGroup(ele.id)}
                className={`relative text-left w-[80%] ${currentGroup === ele.id && "bg-gray-700"}  text-white/60 bg-[#121315] mx-auto px-1 py-1 my-1 rounded-md cursor-pointer hover:text-gray-500/40 text-sm`} >
                  <p>{ele.groupName.length > 15 ? ele.groupName.slice(0,25)+".." : ele.groupName}</p>
                  <div className='border-gray-600 border-b-[1px] border-l-[1px]  h-4 w-4 absolute top-[30%] rounded-bl-md left-[-9%] translate-y-[-50%]'/>
                </div>
              )
            })
          }
          </div>
      </div>}

    
      <div className='w-[90%] mx-auto mt-6  '>
          <p className='flex justify-start items-center gap-4 text-[14px] text-white/60'> <FaRegClock className='text-md'/>Recent</p>
         <div className=''>
          {
          isGroup ?  recent.map((ele, index)=>{
            return (
              <div key={ele.id} className='relative text-left w-[80%] text-white/60 bg-[#121315] mx-auto px-1 py-2 my-1 rounded-md cursor-pointer hover:text-gray-500/40 text-xs' >
                <p>{ele.task.slice(0,25)+".."}</p>
                <div className={` border-gray-600 border-b-[2px] border-l-[2px]  h-4 w-5 absolute top-[24%] rounded-bl-md left-[-9%] translate-y-[-50%]`}/>
              </div>
            )
          })  :recent.map((ele)=>{
              return (
                <div key={ele.id} className='relative text-left w-[80%] text-white/60 bg-[#121315] mx-auto px-1 py-2 my-1 rounded-md cursor-pointer hover:text-gray-500/40' >
                  <p>{ele.task.slice(0,25)+".."}</p>
                  <div className='border-gray-600 border-b-[2px] border-l-[2px]  h-5 w-5 absolute top-[30%] rounded-bl-md left-[-9%] translate-y-[-50%]'/>
                </div>
              )
            })
          }
          </div>
      </div>


    
    </div>

    <div className=''>
     <button 
     onClick={()=>{
      handleTaskCreation()
     }}  
     className='w-[90%] mx-auto flex cursor-pointer text-white anton font-thin border border-gray-700 rounded-md shadow-xs/10  shadow-white justify-center py-2 bg-[#1f2022] items-center'>
        <IoAdd/> <span>New Project</span>
     </button>

    </div>
   </div>
  )
}

export default Projects