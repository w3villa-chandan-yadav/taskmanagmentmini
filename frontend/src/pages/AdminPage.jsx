import React, { useEffect, useState } from "react";
import { FaBan, FaUnlock, FaTrashRestore } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const userss = [
  {
    id: 1,
    name: "Alice",
    email: "alice@example.com",
    tier: "normal",
    isVerified: true,
    isBlocked: false,
    isDeleted: false,
    isAdmin: false,
    createdAt: new Date("2025-07-10T10:00:00.000Z"),
    updatedAt: new Date("2025-07-12T12:00:00.000Z"),
  },
  {
    id: 2,
    name: "Bob",
    email: "bob@example.com",
    tier: "silver",
    isVerified: true,
    isBlocked: false,
    isDeleted: false,
    isAdmin: false,
    createdAt: new Date("2025-07-09T11:15:00.000Z"),
    updatedAt: new Date("2025-07-13T14:30:00.000Z"),
  },
  {
    id: 3,
    name: "Chandan",
    email: "netypy@fxzig.com",
    tier: "silver",
    isVerified: true,
    isBlocked: false,
    isDeleted: false,
    isAdmin: true,
    createdAt: new Date("2025-07-13T14:16:16.000Z"),
    updatedAt: new Date("2025-07-13T16:20:00.000Z"),
  },
  {
    id: 4,
    name: "Daisy",
    email: "daisy@example.com",
    tier: "gold",
    isVerified: true,
    isBlocked: false,
    isDeleted: false,
    isAdmin: false,
    createdAt: new Date("2025-06-01T09:00:00.000Z"),
    updatedAt: new Date("2025-07-01T11:00:00.000Z"),
  },
  {
    id: 5,
    name: "Ethan",
    email: "ethan@example.com",
    tier: "silver",
    isVerified: true,
    isBlocked: true,
    isDeleted: false,
    isAdmin: false,
    createdAt: new Date("2025-06-10T14:00:00.000Z"),
    updatedAt: new Date("2025-07-10T15:00:00.000Z"),
  },
  {
    id: 6,
    name: "Fiona",
    email: "fiona@example.com",
    tier: "normal",
    isVerified: false,
    isBlocked: false,
    isDeleted: false,
    isAdmin: false,
    createdAt: new Date("2025-07-05T08:30:00.000Z"),
    updatedAt: new Date("2025-07-10T08:30:00.000Z"),
  },
  {
    id: 7,
    name: "George",
    email: "george@example.com",
    tier: "gold",
    isVerified: true,
    isBlocked: false,
    isDeleted: true,
    isAdmin: false,
    createdAt: new Date("2025-06-20T10:30:00.000Z"),
    updatedAt: new Date("2025-07-11T10:30:00.000Z"),
  },
  {
    id: 8,
    name: "Hannah",
    email: "hannah@example.com",
    tier: "silver",
    isVerified: true,
    isBlocked: false,
    isDeleted: false,
    isAdmin: true,
    createdAt: new Date("2025-07-12T13:00:00.000Z"),
    updatedAt: new Date("2025-07-13T09:00:00.000Z"),
  },
  {
    id: 9,
    name: "Isaac",
    email: "isaac@example.com",
    tier: "normal",
    isVerified: false,
    isBlocked: true,
    isDeleted: true,
    isAdmin: false,
    createdAt: new Date("2025-06-25T16:45:00.000Z"),
    updatedAt: new Date("2025-07-13T10:00:00.000Z"),
  },
  {
    id: 10,
    name: "Julia",
    email: "julia@example.com",
    tier: "gold",
    isVerified: true,
    isBlocked: false,
    isDeleted: false,
    isAdmin: false,
    createdAt: new Date("2025-07-01T12:00:00.000Z"),
    updatedAt: new Date("2025-07-13T12:30:00.000Z"),
  }
];


const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const { userDetails } = useSelector((state) => state.user);
  const navigate = useNavigate()


  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://taskmanagmentmini.onrender.com/api/v1/admin/all", {
        headers: {
         Authorization: userDetails.token,
        },
      });
      const data = await res.json();
      console.log("dadaidoad-0-0-0", data)
      if (data.success) setUsers(data.users);
    // setUsers(userss)
    } catch (error) {
      console.error("Error fetching users:", error);
    }
    setLoading(false);
  };

  

  useEffect(() => {
    if(!userDetails?.isAdmin){
        navigate("/")
        return
    }
    fetchUsers();
  }, []);

  const updateStatus = async (userId, action) => {
    let url = "";
    if (action === "block") url = `/api/v1/admin/block/${userId}`;
    if (action === "unblock") url = `/api/v1/admin/unblock/${userId}`;
    if (action === "restore") url = `/api/v1/admin/restore/${userId}`;

    try {
      const res = await fetch(`https://taskmanagmentmini.onrender.com${url}`, {
        method: "PUT",
        headers: {
         Authorization: userDetails.token,
        },
      });
      const result = await res.json();
      if (result.success) fetchUsers();
      else alert(result.message);
    } catch (error) {
      console.error("Status update failed:", error);
    }
  };

  const filteredUsers = users.filter((user) => {
    if (filter === "all") return true;
    if (filter === "blocked") return user.isBlocked;
    if (filter === "deleted") return user.isDeleted;
    return true;
  });

  return (
    <div className="p-6 bg-[#0f0f0f] h-screen overflow-y-auto hiddeScrollBar text-white">
      <h1 className="text-2xl font-semibold mb-4">User Management</h1>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 cursor-pointer rounded ${
            filter === "all" ? "bg-blue-600" : "bg-gray-700"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("blocked")}
          className={`px-4 py-2 cursor-pointer rounded ${
            filter === "blocked" ? "bg-blue-600" : "bg-gray-700"
          }`}
        >
          Blocked
        </button>
        <button
          onClick={() => setFilter("deleted")}
          className={`px-4 py-2 cursor-pointer rounded ${
            filter === "deleted" ? "bg-blue-600" : "bg-gray-700"
          }`}
        >
          Deleted
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="bg-[#1a1a1a] p-5 rounded flex justify-between items-center shadow border border-gray-700"
            >
                <div>
              <p className="text-lg font-semibold">{user.name}</p>
              <p className="text-sm text-gray-400">{user.email}</p>
              <div className="text-xs mt-1">
                Tier: <span className="text-yellow-400">{user.tier}</span>
              </div>
              </div>
              <div className="flex gap-2 mt-4">
                {user.isBlocked ? (
                  <button
                    onClick={() => updateStatus(user.id, "unblock")}
                    className="bg-green-600 cursor-pointer hover:bg-green-700 px-3 py-1 rounded text-sm"
                  >
                    <FaUnlock className="inline mr-1" /> Unblock
                  </button>
                ) : (
                  <button
                    onClick={() => updateStatus(user.id, "block")}
                    className="bg-red-600 cursor-pointer hover:bg-red-700 px-3 py-1 rounded text-sm"
                  >
                    <FaBan className="inline mr-1" /> Block
                  </button>
                )}

                {user.isDeleted && (
                  <button
                    onClick={() => updateStatus(user.id, "restore")}
                    className="bg-yellow-600 cursor-pointer hover:bg-yellow-700 px-3 py-1 rounded text-sm"
                  >
                    <FaTrashRestore className="inline mr-1" /> Restore
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserManagement;
