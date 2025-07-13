import React, { useCallback, useEffect, useState } from 'react';
import { FaPen } from "react-icons/fa6";
import { MdAdd } from "react-icons/md";
import { HiMiniUserGroup } from "react-icons/hi2";
import { FaUserAstronaut } from "react-icons/fa";
import { useSelector } from 'react-redux';
import { useTaskContect } from '../contextApi/TaskContext';
import { FaEdit } from "react-icons/fa";
import InviteComponent from '../components/PopupMoodal';
import { toast } from 'react-toastify';






// Sample task data
// const tasks = {
//   start: ["Task 1", "Task 2"],
//   ongoing: ["Task 3"],
//   complete: ["Task 4"],
// };

const FrontPage = () => {

  const { isGroup , setIsGruop, setTasks, tasks }  = useTaskContect()
  
  // console.log(tasks)

  // const [render, setRerender] = useState(false)
  const [start, setStart]  =useState([]);
  const [onGoing, setonGoing]  =useState([]);
  const [Finished, setFinished]  =useState([])

  // start","ongoing","completed"


  // console.log(start)


  const { userDetails } = useSelector((state)=> state.user)



  const handleChangeTask = async (status, id)=>{

    const updateTaskstatus = await fetch("http://localhost:4000/api/v1/task/taskUpdateStatus",{
      method:"put",
      headers: {
        "Content-Type": "application/json",
        Authorization: userDetails.token
      },
      body: JSON.stringify({taskId: id, status: status, isGroup: isGroup})
    })
    const result = await updateTaskstatus.json();
    if(!result.success){
        toast.error(result.message)
         return
    }
    const [newTask] =  tasks.filter((ele)=>{
      return ele.id === id
    })
    newTask.status = status
    // console.log(tasks)
    // setRerender((pre)=> !pre)
    setTasks([...tasks])
  }


  const handleDeleteTask = async ( id)=>{

    const updateTaskstatus = await fetch("http://localhost:4000/api/v1/task/deleteTask",{
      method:"DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: userDetails.token
      },
      body: JSON.stringify({taskId: id, status: status, isGroup: isGroup})
    })
    const result = await updateTaskstatus.json();
    if(!result.success){
        toast.error(result.message)
         return
    }
    const newTask =  tasks.filter((ele)=>{
      return ele.id != id
    })
    // setRerender((pre)=> !pre)
    setTasks(newTask)
  }

  // console.log(userDetails)

  useEffect(()=>{
    setStart(tasks.filter((ele)=>{
      // console.log(ele.status)
      return ele.status === "start"
    })  )

    setonGoing(tasks.filter((ele)=>{
      return ele.status === "ongoing"
    }))

    setFinished(tasks.filter((ele)=>{
      return ele.status === "completed"
    }))

  },[tasks])


  return (
    <div className='h-screen flex-1  w-full p-2  bg-[#121315] text-white  overflow-y-scroll hiddeScrollBar'>
      {/* Heading */}
      <div className='mb-6'>
        <h2 className='anton font-medium text-xl text-white flex gap-3 items-center'>
          {isGroup ? <span className=''> {"group Name"} </span>: <p>Task Name</p> } <FaPen className='text-[15px] pb-1'/>
        </h2>

        <div className='mt-4 '>
        {/* {isGroup ? <div className='flex justify-between'> <HiMiniUserGroup className='text-4xl'/> <button className='px-2 py-2 rounded-sm text-[12px] tracking-tight bg-[#1c1d1f] border-[1px] border-gray-800 shadow-xs/15 shadow-gray-500 flex items-center gap-1 text-white'> <MdAdd/> Invite Member</button>  </div>: <div className='flex justify-between'> <FaUserAstronaut  className='text-4xl'/> <button className='px-2 py-2 rounded-sm text-[12px] tracking-tight bg-[#1c1d1f] border-[1px] border-gray-800 shadow-xs/15 shadow-gray-500 flex items-center gap-1 text-white'>Personal</button>  </div> }  */}
         <InviteComponent isGroup={isGroup}/>
        </div>
      </div>

      {/* Kanban Board */}
      <div className='flex overflow-x-auto w-full hiddeScrollBar'>
        {/* Start Section */}
        <div className=' w-full h-fit'>
        <KanbanColumn  className="" title="Start" tasks={start} handleChangeTask={handleChangeTask} handleDeleteTask={handleDeleteTask} />
         </div> 
        {/* Ongoing Section */}
        <div className=' w-full h-fit'>
        <KanbanColumn title="Ongoing" tasks={onGoing}  handleChangeTask={handleChangeTask} handleDeleteTask={handleDeleteTask} />
        </div>
        {/* Complete Section */}
        <div className='w-full h-fit'>
        <KanbanColumn title="Complete" tasks={Finished} handleChangeTask={handleChangeTask} handleDeleteTask={handleDeleteTask} />
        </div>
      </div>
    </div>
  );
};

const KanbanColumn = ({ title, tasks,handleChangeTask, handleDeleteTask }) => {

  const { isPopUp, setIsPopUp } = useTaskContect()

  const [isOpen, setIsopen] = useState(false)
  const [isOpenTask, setIsOpenTask ] = useState(false)
  const [dropDown, setDropDown] = useState(null)


  const handleAddMore = (e)=>{
    e.preventDefault();
    // console.log("hitted")
    // setIsopen(true)
    setIsPopUp(true)
  }
  
  // const randonHeight = useCallback(()=>{
  //   const height =  Math.round(Math.random() * 100)+90 ;
  //   return height+"px"
  // },[])


  // for using in tailwind 
  const heightClasses = ["h-[50px]", "h-[60px]", "h-[70px]", "h-[80px]", "h-[90px]"];
const randomHeightClass = heightClasses[Math.floor(Math.random() * heightClasses.length)]


  return (
  <div className=' rounded-md p-1 flex-shrink-0 w-full' >

   <div className=' w-full bg-[#292a2c] text-white/70 rounded-sm px-3 py-2 mb-3 flex justify-between items-center'>
  <h3 className='  font-[100] anton  '>{title}</h3>
  <span 
  onClick={(e)=>handleAddMore(e)}
  className=' cursor-pointer'><MdAdd/>
  </span>
    </div>


    <div>
    <div className='flex flex-col gap-1'>
      {tasks.map((task, index) => (
        <div key={index}
        onClick={()=>setIsOpenTask((pre)=>{
          return task.id === pre ? false : task.id 
        })}
        style={{ height: isOpenTask === task.id ?  "250px" : "120px" }}
        className={`bg-[#26282c] relative p-3 text-white/70 rounded-md shadow-md ${isOpenTask === task.id ? "overflow-y-scroll hiddeScrollBar": `overflow-hidden`}`}>
          {isOpenTask === task.id ?  task.task : `${task.task.slice(0,70)+"..."}`}
          <div 
          onClick={(e)=>{
             e.stopPropagation()
            setDropDown((pre)=>{
            return task.id === pre ? false : task.id 
          })}}
          className='h-3 w-3 cursor-pointer absolute top-1 right-2 '>
             <FaEdit/>
            {dropDown === task.id && <div className='relative backdrop-blur-xl bg-white/40 rounded-md  w-[120px] h-[88px] -translate-x-[90%] translate-y-[10%]'>
                 <p onClick={()=>{
                  handleChangeTask("start",task.id)
                 }} className='text-center anton text-[13px] border-b border-white/50 py-[1px] cursor-pointer'>Start</p>
                 <p onClick={()=>{
                  handleChangeTask("ongoing", task.id)
                 }} className='text-center anton text-[13px] border-b border-white/50 py-[1px] cursor-pointer'>onGoing</p>
                 <p onClick={()=>{
                  handleChangeTask("completed", task.id) 
                 }} className='text-center anton text-[13px] py-[1px]  border-b border-white/50 cursor-pointer'>Finished</p>
                  <p onClick={()=>{
                  handleDeleteTask(task.id) 
                 }} className='text-center anton text-[13px] py-[1px] cursor-pointer'>Delete</p>
             </div>}
            </div>
        </div>
      ))}
    </div>
      </div>
  </div>)
};

export default FrontPage;





