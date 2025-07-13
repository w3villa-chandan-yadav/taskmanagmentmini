import { createContext, useContext, useState } from "react";

const TaskContect = createContext();


export const TaskContextProvider = ({children})=>{

    const [isGroup ,setIsGruop ] = useState(false);

    const [tasks, setTasks] = useState([])

    const [teamm, setTeamm] = useState([])

    const [recent, setRecent] = useState([]) 

    const [ currentGroup, setCurrentGroup] = useState(null)
      
    const [isPopUp, setIsPopUp ] = useState(false)

    const [notification, setNotifications] = useState(0)


    const value = { isGroup , setIsGruop, isPopUp, setIsPopUp  ,setTasks, tasks, teamm, setTeamm, setRecent, recent, currentGroup, setCurrentGroup, notification, setNotifications}

    return <TaskContect.Provider value={ value }>
        {children}
    </TaskContect.Provider>
}

export const useTaskContect = ()=>{
    return useContext(TaskContect)
};