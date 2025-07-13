// import React from 'react';
// import { useEffect } from 'react';
// import { FaUsers, FaTasks, FaUserClock, FaLayerGroup } from 'react-icons/fa';
// import { MdOutlineGroupAdd } from 'react-icons/md';
// import { useSelector } from 'react-redux';

// const Dashboard = () => {
//     const { userDetails } = useSelector((state)=> state.user)

//   const stats = [
//     {
//       title: 'Groups Managed',
//       icon: <FaLayerGroup className="text-xl text-blue-400" />,
//       value: 4,
//     },
//     {
//       title: 'Total Tasks',
//       icon: <FaTasks className="text-xl text-green-400" />,
//       value: 35,
//     },
//     {
//       title: 'Active Members',
//       icon: <FaUsers className="text-xl text-purple-400" />,
//       value: 28,
//     },
//     {
//       title: 'Pending Invites',
//       icon: <MdOutlineGroupAdd className="text-xl text-yellow-400" />,
//       value: 3,
//     },
//   ];

//   const groupList = [
//     { name: 'Product Design Team', tasks: 12, members: 6, completed: 8 },
//     { name: 'Frontend Team', tasks: 8, members: 4, completed: 5 },
//     { name: 'Backend Devs', tasks: 10, members: 5, completed: 7 },
//   ];

//     const FetchDashBoard = async ()=>{

//     const updateTaskstatus = await fetch("http://localhost:4000/api/v1/task/dashboard",{
//       method:"GET",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: userDetails.token
//       },
//     })
//     const result = await updateTaskstatus.json();
//     if(!result.success){
//         alert(result.message)
//          return
//     }
//   }



//   useEffect(()=>{
  
//   },[])

//   return (
//     <div className="min-h-screen bg-[#0f0f0f] text-white p-6">
//       <h1 className="text-3xl font-semibold mb-6">Dashboard</h1>

//       {/* Top stats */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
//         {stats.map((stat, index) => (
//           <div
//             key={index}
//             className="bg-[#1a1a1a] p-5 rounded-lg shadow-md flex items-center gap-4 border border-gray-800"
//           >
//             <div className="p-3 bg-[#2a2a2a] rounded-full">{stat.icon}</div>
//             <div>
//               <p className="text-sm text-gray-400">{stat.title}</p>
//               <p className="text-xl font-bold">{stat.value}</p>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Group overview */}
//       <div className="mb-10">
//         <h2 className="text-2xl font-semibold mb-4">Your Groups</h2>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           {groupList.map((group, index) => {
//             const progress = Math.round((group.completed / group.tasks) * 100);
//             return (
//               <div
//                 key={index}
//                 className="bg-[#1a1a1a] p-5 rounded-lg border border-gray-800 shadow-md"
//               >
//                 <h3 className="text-lg font-semibold mb-2">{group.name}</h3>
//                 <p className="text-sm text-gray-400 mb-1">
//                   {group.tasks} Tasks • {group.members} Members
//                 </p>
//                 <div className="h-2 w-full bg-gray-700 rounded-full mt-2 mb-2">
//                   <div
//                     className="h-full bg-green-500 rounded-full transition-all duration-300"
//                     style={{ width: `${progress}%` }}
//                   ></div>
//                 </div>
//                 <p className="text-sm text-gray-300">{progress}% Completed</p>
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       {/* Recent Activity (optional) */}
//       <div>
//         <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
//         <ul className="space-y-3 text-sm text-gray-300">
//           <li>✅ You completed “Design Homepage” in Product Design Team</li>
//           <li>📩 Invited John Doe to Backend Devs</li>
//           <li>🕒 “API Integration” task due tomorrow in Frontend Team</li>
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;
import React, { useEffect, useState } from 'react';
import { FaUsers, FaTasks, FaUserClock, FaLayerGroup } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const { userDetails } = useSelector((state) => state.user);
  const [stats, setStats] = useState([]);
  const [groupList, setGroupList] = useState([]);
  const [loading, setLoading] = useState(true);

  const FetchDashBoard = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://taskmanagmentmini.onrender.com/api/v1/task/dashboard", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: userDetails.token,
        },
      });

      const result = await response.json();

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      setStats([
        {
          title: 'Groups Managed',
          icon: <FaLayerGroup className="text-xl text-blue-400" />,
          value: result.Groups,
        },
        {
          title: 'Total Tasks',
          icon: <FaTasks className="text-xl text-green-400" />,
          value: result.GroupTask + result.totalTask,
        },
        {
          title: 'Active Members',
          icon: <FaUsers className="text-xl text-purple-400" />,
          value: result.AllUser.reduce((sum, g) => sum + g.participantCount, 0),
        },
        {
          title: 'Completed Tasks',
          icon: <FaUserClock className="text-xl text-yellow-400" />,
          value: result.AllUser.reduce((sum, g) => sum + g.completedTaskCount, 0),
        },
      ]);

      const transformedGroups = result.AllUser.map((group) => ({
        name: group.groupName,
        tasks: group.taskCount,
        members: group.participantCount,
        completed: group.completedTaskCount,
      }));

      setGroupList(transformedGroups);
      setLoading(false);
    } catch (error) {
      console.error("Dashboard fetch error:", error);
      toast.error("Something went wrong fetching dashboard data");
      setLoading(false);
    }
  };

  useEffect(() => {
    FetchDashBoard();
  }, []);

  return (
    <div className="h-screen overflow-auto hiddeScrollBar bg-[#0f0f0f] text-white p-6">
      <h1 className="text-3xl font-semibold mb-6">Dashboard</h1>

      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {loading
          ? Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="bg-[#1a1a1a] p-5 rounded-lg shadow-md border border-gray-800 animate-pulse"
              >
                <div className="h-6 w-6 bg-gray-700 rounded-full mb-3" />
                <div className="h-4 w-1/2 bg-gray-600 rounded mb-1" />
                <div className="h-5 w-1/3 bg-gray-700 rounded" />
              </div>
            ))
          : stats.map((stat, index) => (
              <div
                key={index}
                className="bg-[#1a1a1a] p-5 rounded-lg shadow-md flex items-center gap-4 border border-gray-800"
              >
                <div className="p-3 bg-[#2a2a2a] rounded-full">{stat.icon}</div>
                <div>
                  <p className="text-sm text-gray-400">{stat.title}</p>
                  <p className="text-xl font-bold">{stat.value}</p>
                </div>
              </div>
            ))}
      </div>

      {/* Group Overview */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Your Groups</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-[#1a1a1a] p-5 rounded-lg border border-gray-800 shadow-md animate-pulse"
                >
                  <div className="h-5 bg-gray-700 rounded w-2/3 mb-2" />
                  <div className="h-4 bg-gray-600 rounded w-1/2 mb-4" />
                  <div className="h-2 bg-gray-800 rounded w-full mb-2" />
                  <div className="h-4 bg-gray-700 rounded w-1/3" />
                </div>
              ))
            : groupList.map((group, index) => {
                const progress =
                  group.tasks > 0 ? Math.round((group.completed / group.tasks) * 100) : 0;

                return (
                  <div
                    key={index}
                    className="bg-[#1a1a1a] p-5 rounded-lg border border-gray-800 shadow-md"
                  >
                    <h3 className="text-lg font-semibold mb-2">{group.name}</h3>
                    <p className="text-sm text-gray-400 mb-1">
                      {group.tasks} Tasks • {group.members} Members
                    </p>
                    <div className="h-2 w-full bg-gray-700 rounded-full mt-2 mb-2">
                      <div
                        className="h-full bg-green-500 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-300">{progress}% Completed</p>
                  </div>
                );
              })}
        </div>
      </div>

      {/* Optional: Recent Activity (static for now) */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Recent Activity<span className='text-[12px]'>(Feature comming soon)</span> </h2>
        <ul className="space-y-3 text-sm text-gray-300">
          <li>✅ You completed “Design Homepage” in Product Design Team</li>
          <li>📩 Invited John Doe to Backend Devs</li>
          <li>🕒 “API Integration” task due tomorrow in Frontend Team</li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;

