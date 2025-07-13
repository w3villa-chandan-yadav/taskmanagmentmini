// // src/pages/ProfilePage.jsx
// import React, { useState, useEffect } from 'react';

// const ProfilePage = () => {
//   const [profile, setProfile] = useState({
//     name: 'John Doe',
//     email: 'john@example.com',
//     role: 'Developer',
//     theme: 'dark',
//   });

//   const [editing, setEditing] = useState(false);
//   const [form, setForm] = useState({ ...profile });

//   useEffect(() => {
//     // TODO: Fetch profile from backend
//   }, []);

//   const handleInputChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSave = () => {
//     setProfile(form);
//     setEditing(false);
//     // TODO: Send updated profile to backend
//   };

//   const handleCancel = () => {
//     setForm(profile);
//     setEditing(false);
//   };

//   return (
//     <div className="p-6 bg-[#0f0f0f] overflow-y-auto hiddeScrollBar h-screen text-white">
//       <h1 className="text-3xl font-semibold mb-6 border-b border-gray-700 pb-3">
//         Profile Management
//       </h1>

//       <div className="bg-[#1f2022] p-6 rounded-lg shadow border border-gray-700 max-w-2xl mx-auto">
//         <div className="flex items-center gap-4 mb-6">
//           <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center text-xl font-bold">
//             {profile.name.charAt(0).toUpperCase()}
//           </div>
//           <div>
//             <p className="text-lg font-medium">{profile.name}</p>
//             <p className="text-sm text-gray-400">{profile.email}</p>
//           </div>
//         </div>

//         <form className="space-y-4">
//           <div>
//             <label className="block text-sm mb-1">Name</label>
//             <input
//               name="name"
//               value={form.name}
//               onChange={handleInputChange}
//               className="bg-[#292a2c] w-full px-3 py-2 rounded border border-gray-600 focus:outline-none"
//               disabled={!editing}
//             />
//           </div>

//           <div>
//             <label className="block text-sm mb-1">Email</label>
//             <input
//               name="email"
//               value={form.email}
//               onChange={handleInputChange}
//               className="bg-[#292a2c] w-full px-3 py-2 rounded border border-gray-600 focus:outline-none"
//               disabled
//             />
//           </div>

//           <div>
//             <label className="block text-sm mb-1">Role</label>
//             <input
//               name="role"
//               value={form.role}
//               onChange={handleInputChange}
//               className="bg-[#292a2c] w-full px-3 py-2 rounded border border-gray-600 focus:outline-none"
//               disabled={!editing}
//             />
//           </div>

//           <div>
//             <label className="block text-sm mb-1">Preferred Theme</label>
//             <select
//               name="theme"
//               value={form.theme}
//               onChange={handleInputChange}
//               className="bg-[#292a2c] w-full px-3 py-2 rounded border border-gray-600 text-white"
//               disabled={!editing}
//             >
//               <option value="dark">Dark</option>
//               <option value="light">Light</option>
//             </select>
//           </div>

//           {editing ? (
//             <div className="flex gap-4 pt-4">
//               <button
//                 type="button"
//                 onClick={handleSave}
//                 className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-sm"
//               >
//                 Save
//               </button>
//               <button
//                 type="button"
//                 onClick={handleCancel}
//                 className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded text-sm"
//               >
//                 Cancel
//               </button>
//             </div>
//           ) : (
//             <button
//               type="button"
//               onClick={() => setEditing(true)}
//               className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm mt-4"
//             >
//               Edit Profile
//             </button>
//           )}
//         </form>

//         <div className="mt-10 border-t border-gray-700 pt-4">
//           <h2 className="text-red-500 font-medium mb-2">Danger Zone</h2>
//           <button className="bg-red-700 hover:bg-red-800 px-4 py-2 rounded text-sm">
//             Delete Account
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;


import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const ProfilePage = () => {
  const { userDetails } = useSelector((state) => state.user);

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    role: '',
    theme: 'dark',
  });

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...profile });
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/v1/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: userDetails.token,
          },
        });

        const data = await res.json();
        if (data.success) {
          setProfile(data.user);
          setForm(data.user);
        } else {
          toast.error(data.message || 'Failed to load profile');
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    };

    fetchProfile();
  }, [userDetails.token]);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/v1/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: userDetails.token,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (data.success) {
        setProfile(form);
        setEditing(false);
        toast.success("Profile Updated Successfully");
      } else {
        toast.error(data.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
    }
  };

  const handleCancel = () => {
    setForm(profile);
    setEditing(false);
  };

  const handleDeleteAccount = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/v1/delete-account', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: userDetails.token,
        },
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Account deleted successfully.");
        // You can redirect to login or homepage here
      } else {
        toast.error(data.message || "Failed to delete account.");
      }
    } catch (err) {
      console.error("Error deleting account:", err);
    } finally {
      setShowConfirmDelete(false);
    }
  };

  return (
      <div className='relative'>
    <div className="p-6 bg-[#0f0f0f] overflow-y-auto hiddeScrollBar h-screen text-white ">
      <h1 className="text-3xl font-semibold mb-6 border-b border-gray-700 pb-3">
        Profile Management
      </h1>

      <div className="bg-[#1f2022] p-6 rounded-lg shadow border border-gray-700 max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center text-xl font-bold">
            {profile.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-lg font-medium">{profile.name}</p>
            <p className="text-sm text-gray-400">{profile.email}</p>
          </div>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Name</label>
            <input
              name="name"
              value={form.name || ""}
              onChange={handleInputChange}
              className="bg-[#292a2c] w-full px-3 py-2 rounded border border-gray-600 focus:outline-none"
              disabled={!editing}
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              name="email"
              value={form.email || ""}
              onChange={handleInputChange}
              className="bg-[#292a2c] w-full px-3 py-2 rounded border border-gray-600 focus:outline-none"
              disabled
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Role</label>
            <input
              name="role"
              value={form.role || ""}
              onChange={handleInputChange}
              className="bg-[#292a2c] w-full px-3 py-2 rounded border border-gray-600 focus:outline-none"
              disabled={!editing}
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Preferred Theme</label>
            <select
              name="theme"
              value={form.theme || ""}
              onChange={handleInputChange}
              className="bg-[#292a2c] w-full px-3 py-2 rounded border border-gray-600 text-white"
              disabled={!editing}
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>
          </div>

          {editing ? (
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-sm"
              >
                Save
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded text-sm"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm mt-4"
            >
              Edit Profile
            </button>
          )}
        </form>

        <div className="mt-10 border-t border-gray-700 pt-4">
          <h2 className="text-red-500 font-medium mb-2">Danger Zone</h2>
          <button
            onClick={() => setShowConfirmDelete(true)}
            className="bg-red-700 hover:bg-red-800 px-4 py-2 rounded text-sm"
          >
            Delete Account
          </button>
        </div>
      </div>

      {/* ⚠️ Delete Confirmation Popup */}
      {showConfirmDelete && (
        <div className="absolute inset-0 overflow-hidden bg-black/70 backdrop-blur-[4px]  flex justify-center items-center z-50">
          <div className="bg-[#1f1f1f] p-6 rounded-lg shadow border border-gray-600 text-white max-w-sm">
            <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
            <p className="text-sm mb-6">
              Are you sure you want to delete your account? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="bg-red-700 hover:bg-red-800 px-4 py-2 rounded text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default ProfilePage;
