// import React, { useEffect, useState } from 'react';
// import { FaCheckCircle, FaUserPlus, FaCommentDots, FaBell } from 'react-icons/fa';
// import socket from '../utils/socket';

// const initialNotifications = [
//   {
//     type: 'task',
//     icon: <FaCheckCircle className="text-green-400" />,
//     message: 'You completed the task "Design Login Page".',
//     time: '2 hours ago',
//   },
//   {
//     type: 'group',
//     icon: <FaUserPlus className="text-blue-400" />,
//     message: 'Alice joined your group "Backend Team".',
//     time: '5 hours ago',
//   },
//   {
//     type: 'invite',
//     icon: <FaUserPlus className="text-yellow-400" />,
//     message: 'Invite sent to john@example.com',
//     time: '2 days ago',
//   },
// ];

// const NotificationContent = () => {
//   const [notifications, setNotification] = useState(initialNotifications);

//   useEffect(() => {
//     socket.on('new_invite', (data) => {
//       console.log('📬 receiving invite');
//       setNotification((prev) => [
//         {
//           type: 'invite',
//           icon: <FaUserPlus className="text-yellow-400" />,
//           message: `${data.message}`,
//           time: 'just now',
//         },
//         ...prev,
//       ]);
//     });

//     return () => {
//       socket.off('new_invite');
//     };
//   }, []);

//   const handleAccept = (notification) => {
//     console.log('✅ Accept clicked:', notification);
//     // TODO: Call backend API or emit socket event here
//   };

//   const handleReject = (notification) => {
//     console.log('❌ Reject clicked:', notification);
//     // TODO: Call backend API or emit socket event here
//   };

//   return (
//     <div className="bg-[#1f2022] text-white p-6 rounded-lg shadow-lg border border-gray-700 w-full mx-auto">
//       <h2 className="text-2xl font-semibold mb-6 border-b border-gray-600 pb-2">Notifications</h2>

//       <ul className="space-y-4">
//         {notifications.map((note, index) => (
//           <li
//             key={index}
//             className="flex flex-col gap-2 bg-[#292a2c] p-4 rounded-md border border-gray-600 hover:bg-[#313234] transition"
//           >
//             <div className="flex items-start gap-4">
//               <div className="text-xl pt-1">{note.icon}</div>
//               <div className="flex-1">
//                 <p className="text-sm mb-1">{note.message}</p>
//                 <span className="text-xs text-gray-400">{note.time}</span>
//               </div>
//             </div>

//             {note.type === 'invite' && (
//               <div className="flex gap-4 justify-end mt-2">
//                 <button
//                   onClick={() => handleAccept(note)}
//                   className="bg-green-600 hover:bg-green-700 px-4 py-1 text-sm rounded text-white"
//                 >
//                   Accept
//                 </button>
//                 <button
//                   onClick={() => handleReject(note)}
//                   className="bg-red-600 hover:bg-red-700 px-4 py-1 text-sm rounded text-white"
//                 >
//                   Reject
//                 </button>
//               </div>
//             )}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// const NotificationSection = () => (
//   <div className="bg-[#0f0f0f] h-screen overflow-y-auto hiddeScrollBar py-10 px-4">
//     <NotificationContent />
//   </div>
// );

// export default NotificationSection;



import React, { useEffect, useState } from 'react';
import { FaCheckCircle, FaUserPlus, FaCommentDots, FaBell } from 'react-icons/fa';
import socket from '../utils/socket';
import { useSelector } from 'react-redux';
import { useTaskContect } from '../contextApi/TaskContext';

const iconMap = {
  task: <FaCheckCircle className="text-green-400" />,
  group: <FaUserPlus className="text-blue-400" />,
  comment: <FaCommentDots className="text-purple-400" />,
  alert: <FaBell className="text-red-400" />,
  invite: <FaUserPlus className="text-yellow-400" />,
};

const NotificationContent = () => {
  const { userDetails } = useSelector((state) => state.user);
  const [notifications, setNotification] = useState([]);
  const { notification, setNotifications}  = useTaskContect()
  

  // Fetch notifications from backend
  const fetchNotifications = async () => {
    try {
      const res = await fetch('https://taskmanagmentmini.onrender.com/api/v1/notification/allNotifications', {
        method: "GET",
        headers: {
          Authorization: userDetails?.token,
        },
      });
      const data = await res.json();
      if (data.success) {
        // console.log(data)
        setNotification(
          data.notifications.map((note) => ({
            ...note,
            icon: iconMap[note.type] || <FaBell className="text-white" />,
            time: new Date(note.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          }))
        );
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };
  // Accept invitation
  const handleAccept = async (note) => {
    // console.log('✅ Accept clicked:', note);
    //  const res = await fetch(`http://localhost:4000/api/v1/notification/acceptInvitation?id=${note}`, {
    //     method: "PUT",
    //     headers: {
    //       Authorization: userDetails?.token,
    //     },
    //     // body: JSON.stringify()
    //   });
    // Call your backend logic to accept invite (e.g., join group)
    await markNotificationRead(note);
  };

  // Reject invitation
  const handleReject = async (note) => {
    // console.log('❌ Reject clicked:', note);
    // Optionally delete or mark as read
    toast.success("Rejected, but can join later")
    // await markNotificationRead(note.id);
  };

  // Mark as read
  const markNotificationRead = async (id) => {
    try {
      await fetch(`https://taskmanagmentmini.onrender.com/api/v1/notification/acceptInvitation/${id}`, {
        method: 'PATCH',
        headers: {
          Authorization: userDetails?.token,
        },
      });
      setNotification((prev) =>
        prev.map((n) => (n.id === id ? { ...n, seen: true, status: "accepted" } : n))
      );
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

   const makeAllRead = async () => {
    try {
      await fetch(`https://taskmanagmentmini.onrender.com/api/v1/notification/makeAllAsRead`, {
        headers: {
          Authorization: userDetails?.token,
        },
      });
      setNotifications(0)
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  // Socket listener
  useEffect(() => {
    socket.on('new_invite', (data) => {
      // console.log('📬 receiving invite');
      setNotification((prev) => [
        {
          ...data,
          icon: iconMap['invite'],
          time: 'just now',
          seen: false,
          type: "invite"
        },
        ...prev,
      ]);
    });
    setNotifications((prev)=> prev +1 )
    return () => socket.off('new_invite');
  }, []);

  useEffect(() => {
    fetchNotifications();
    makeAllRead();
  }, []);
// makeAllAsRead
  return (
    <div className="bg-[#1f2022] text-white p-6 rounded-lg shadow-lg border border-gray-700 w-full mx-auto">
      <h2 className="text-2xl font-semibold mb-6 border-b border-gray-600 pb-2">Notifications</h2>

      <ul className="space-y-4">
        {notifications.map((note, index) => (
          <li
            key={index}
            className={`flex  justify-between gap-2 bg-[#292a2c] p-4 rounded-md border items-center ${
              note.seen ? 'border-gray-600' : 'border-yellow-500'
            } hover:bg-[#313234] transition`}
          >
            <div className="flex items-start gap-4">
              <div className="text-xl pt-1">{note.icon}</div>
              <div className="flex-1">
                <p className="text-sm mb-1">{note.message}</p>
                <span className="text-xs text-gray-400">{note.time}</span>
              </div>
            </div>

            {note.type === 'invite' &&   note.status !='accepted' ?( 
              <div className="flex gap-4 justify-end mt-2">
                <button
                  onClick={() => handleAccept(note.id)}
                  className="bg-green-600 hover:bg-green-700 px-4 h-[30px] py-1 text-sm rounded text-white"
                >
                  Accept 
                </button>
                <button
                  onClick={() => handleReject(note)}
                  className="bg-red-600 hover:bg-red-700 h-[30px] px-4 py-1 text-sm rounded text-white"
                >
                  Reject
                </button>
              </div>
            ):   <button
                  // onClick={() => handleReject(note)}
                  className="bg-green-600 hover:bg-green-700  h-[30px] px-4 cursor-pointer py-1 text-sm rounded text-white"
                >
                  accepted
                </button>}
          </li>
        ))}
      </ul>
    </div>
  );
};

const NotificationSection = () => (
  <div className="bg-[#0f0f0f] h-screen overflow-y-auto hiddeScrollBar py-10 px-4">
    <NotificationContent />
  </div>
);

export default NotificationSection;
