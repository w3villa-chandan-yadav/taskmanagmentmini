import React, { useEffect, useState } from "react";
import { FaBan, FaUnlock, FaTrashRestore } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

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
    } catch (error) {
      console.error("Error fetching users:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if(!userDetails.isAdmin){
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
    <div className="p-6 bg-[#0f0f0f] min-h-screen text-white">
      <h1 className="text-2xl font-semibold mb-4">User Management</h1>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded ${
            filter === "all" ? "bg-blue-600" : "bg-gray-700"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("blocked")}
          className={`px-4 py-2 rounded ${
            filter === "blocked" ? "bg-blue-600" : "bg-gray-700"
          }`}
        >
          Blocked
        </button>
        <button
          onClick={() => setFilter("deleted")}
          className={`px-4 py-2 rounded ${
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
                    className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm"
                  >
                    <FaUnlock className="inline mr-1" /> Unblock
                  </button>
                ) : (
                  <button
                    onClick={() => updateStatus(user.id, "block")}
                    className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
                  >
                    <FaBan className="inline mr-1" /> Block
                  </button>
                )}

                {user.isDeleted && (
                  <button
                    onClick={() => updateStatus(user.id, "restore")}
                    className="bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded text-sm"
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
