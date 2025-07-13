// import { useState, useRef, useEffect } from 'react';
// import { HiMiniUserGroup } from 'react-icons/hi2';
// import { FaUserAstronaut } from 'react-icons/fa';
// import { MdAdd } from 'react-icons/md';
// import { RiSearch2Line } from "react-icons/ri";

// const dummyUsers = [
//   { id: 1, name: 'Alice Johnson' },
//   { id: 2, name: 'Bob Smith' },
//   { id: 3, name: 'Charlie Adams' },
//   { id: 4, name: 'Daniel Kim' },
//   { id: 5, name: 'Eva Lee' },
//   { id: 6, name: 'Frankie Baker' },
//   { id: 7, name: 'Grace Walker' },
//   { id: 8, name: 'Harry Liu' },
//   { id: 9, name: 'Isabella Moore' },
//   { id: 10, name: 'Jack Green' },
//   // add more if needed
// ];

// const InviteComponent = ({ isGroup }) => {
//   const [showPopup, setShowPopup] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
//   const popupRef = useRef(null);

//   const handleTogglePopup = () => {
//     setShowPopup((prev) => !prev);
//   };

//   const handleClickOutside = (event) => {
//     if (popupRef.current && !popupRef.current.contains(event.target)) {
//       setShowPopup(false);
//     }
//   };

//   useEffect(() => {
//     if (showPopup) {
//       document.addEventListener('mousedown', handleClickOutside);
//     } else {
//       document.removeEventListener('mousedown', handleClickOutside);
//     }

//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [showPopup]);

//   // Filter users by search term
//   const filteredUsers = dummyUsers.filter(user =>
//     user.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="mt-4 relative">
//       {isGroup ? (
//         <div className="flex justify-between items-center">
//           <HiMiniUserGroup className="text-4xl" />
//           <button
//             onClick={handleTogglePopup}
//             className="px-2 py-2 rounded-sm text-[12px] tracking-tight bg-[#1c1d1f] border-[1px] border-gray-800 shadow-xs/15 shadow-gray-500 flex items-center gap-1 text-white"
//           >
//             <MdAdd />
//             Invite Member
//           </button>
//         </div>
//       ) : (
//         <div className="flex justify-between items-center">
//           <FaUserAstronaut className="text-4xl" />
//           <button
//             className="px-2 py-2 rounded-sm text-[12px] tracking-tight bg-[#1c1d1f] border-[1px] border-gray-800 shadow-xs/15 shadow-gray-500 flex items-center gap-1 text-white"
//           >
//             Personal
//           </button>
//         </div>
//       )}

//       {/* Popup below the button */}
//       {showPopup && (
//         <div
//           ref={popupRef}
//           className="absolute right-0 mt-2 w-64 rounded-sm bg-[#121315] border border-gray-400 text-white z-50"
//         >
//           {/* Search bar */}
//           <div className="flex items-center gap-2 px-2 py-2 border-b border-gray-600">
//             <RiSearch2Line className="text-white text-[20px]" />
//             <input
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="bg-transparent text-gray-200 py-1 text-[13px] outline-none w-full"
//               placeholder="Search..."
//               type="text"
//             />
//           </div>

//           {/* Results list */}
//             <div className="max-h-40 overflow-y-auto scrollbar-hide hiddeScrollBar">
//             {filteredUsers.length > 0 ? (
//               filteredUsers.map((user) => (
//                 <div
//                   key={user.id}
//                   className="px-3 py-2 hover:bg-[#1e1f22] cursor-pointer text-[13px] border-b border-gray-700 last:border-0"
//                 >
//                   {user.name}
//                 </div>
//               ))
//             ) : (
//               <div className="px-3 py-3 text-gray-400 text-[13px]">
//                 No members found
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default InviteComponent;



import { useState, useRef, useEffect } from 'react';
import { HiMiniUserGroup } from 'react-icons/hi2';
import { FaUserAstronaut } from 'react-icons/fa';
import { MdAdd } from 'react-icons/md';
import { RiSearch2Line } from "react-icons/ri";
import { useSelector } from 'react-redux';
import { useTaskContect } from '../contextApi/TaskContext';
import { FaDownload } from "react-icons/fa";
import { toast } from 'react-toastify';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';



const InviteComponent = ({ isGroup }) => {
    const { userDetails } = useSelector((state) => state.user);
       const {currentGroup ,tasks} = useTaskContect()
       
    

  const [showPopup, setShowPopup] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const popupRef = useRef(null);
  const debounceRef = useRef(null);

  const handleTogglePopup = () => setShowPopup((prev) => !prev);

  const handleClickOutside = (event) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      setShowPopup(false);
    }
  };


   const handleDownload = () => {
      if(userDetails.tier === "normal" || userDetails.tier === "silver"){
      toast.info("Please upgrate to gold")
     return 
    }
  // console.log("tasjsifdiofjskdf", tasks)

        const doc = new jsPDF();

        doc.text('Task Report', 14, 20);

        autoTable(doc, {
          startY: 30,
          head: [['Title', 'Status', 'Created Date', 'Importance']],
          body: tasks.map(task => [
            task.task,
            task.status,
            new Date(task.createdAt).toLocaleDateString(),
            task.importance,
          ]),
        });

        doc.save('tasks.pdf');


  };
  

  const handleInvite = async (userId) => {
  const res = await fetch("https://taskmanagmentmini.onrender.com/api/v1/notification/invite", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: userDetails.token,
    },
    body: JSON.stringify({
      receiverId: userId,
      groupId: currentGroup, 
    }),
  });

  const result = await res.json();
  if (result.success) {
    alert("Invitation sent!");
  } else {
    alert(result.message || "Failed to invite");
  }
};


  useEffect(() => {
    if (showPopup) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPopup]);

  // 🔁 Debounced Fetch Function
  useEffect(() => {
    if (!showPopup) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      if (searchTerm.trim() === '') {
        setFilteredUsers([]);
        return;
      }

      setLoading(true);

      fetch(`https://taskmanagmentmini.onrender.com/api/v1/task/searchUser?query=${encodeURIComponent(searchTerm)}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Add Authorization header if needed
           Authorization: userDetails.token,
        },
      })
        .then(res => res.json())
        .then(data => {
          // console.log(data.users)
          setFilteredUsers(data.users || []);
        })
        .catch(err => {
          console.error("Error fetching users:", err);
          setFilteredUsers([]);
        })
        .finally(() => setLoading(false));
    }, 400); // ⏱ debounce time

    return () => clearTimeout(debounceRef.current);
  }, [searchTerm, showPopup]);

  return (
    <div className="mt-4 relative">
      {isGroup ? (
        <div className="flex justify-between items-center">
          <HiMiniUserGroup className="text-4xl" />
          <div className='flex gap-3'>
          <button
            onClick={handleTogglePopup}
            className="px-2 py-2 cursor-pointer rounded-sm text-[12px] tracking-tight bg-[#1c1d1f] border-[1px] border-gray-800 shadow-xs/15 shadow-gray-500 flex items-center gap-1 text-white"
          >
            <MdAdd />
            Invite Member 
          </button>

            <button
            onClick={handleDownload}
            className="px-2 py-2 cursor-pointer rounded-sm text-[12px] tracking-tight bg-[#1c1d1f] border-[1px] border-gray-800 shadow-xs/15 shadow-gray-500 flex items-center gap-1 text-white"
          >
            <FaDownload />
            Download Tasks
          </button>
          
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-center">
          <FaUserAstronaut className="text-4xl" />
          <div className='flex gap-3'> 
          <button
            className="px-2 py-2 rounded-sm text-[12px] tracking-tight bg-[#1c1d1f] border-[1px] border-gray-800 shadow-xs/15 shadow-gray-500 flex items-center gap-1 text-white"
          >
            Personal
          </button>
            <button
            onClick={handleDownload}
            className="px-2 py-2 cursor-pointer rounded-sm text-[12px] tracking-tight bg-[#1c1d1f] border-[1px] border-gray-800 shadow-xs/15 shadow-gray-500 flex items-center gap-1 text-white"
          >
            <FaDownload />
            Download Tasks
          </button>
          </div>
        </div>
      )}

      {showPopup && (
        <div
          ref={popupRef}
          className="absolute right-0 mt-2 w-64 rounded-sm bg-[#121315] border border-gray-400 text-white z-50"
        >
          <div className="flex items-center gap-2 px-2 py-2 border-b border-gray-600">
            <RiSearch2Line className="text-white text-[20px]" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent text-gray-200 py-1 text-[13px] outline-none w-full"
              placeholder="Search..."
              type="text"
            />
          </div>

          <div className="max-h-40 overflow-y-auto scrollbar-hide hiddeScrollBar">
            {loading ? (
              <div className="px-3 py-3 text-gray-400 text-[13px]">Searching...</div>
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <div
                  key={user.id}
                  onClick={()=>handleInvite(user.id)}
                  className="px-3 py-2 hover:bg-[#1e1f22] cursor-pointer text-[13px] border-b border-gray-700 last:border-0"
                >
                  {user.email}
                </div>
              ))
            ) : (
              <div className="px-3 py-3 text-gray-400 text-[13px]">No members found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default InviteComponent;
