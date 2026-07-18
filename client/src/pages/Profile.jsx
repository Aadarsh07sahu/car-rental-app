import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = "http://localhost:5000/api";

function Profile() {
 const { user, token, setUser } = useAuth();

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
const [passwordLoading, setPasswordLoading] = useState(false);

const [passwordData, setPasswordData] = useState({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let res;

      if (profileImage) {
        const data = new FormData();
        data.append("firstName", formData.firstName);
        data.append("lastName", formData.lastName);
        data.append("email", formData.email);
        data.append("phone", formData.phone);
        data.append("profileImage", profileImage);

        res = await axios.put(`${API_URL}/users/profile`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        res = await axios.put(
          `${API_URL}/users/profile`,
          {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
setUser(res.data.user);
localStorage.setItem("user", JSON.stringify(res.data.user));
toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };
  const handlePasswordChange = async (e) => {
  e.preventDefault();

  if (passwordData.newPassword !== passwordData.confirmPassword) {
    return toast.error("New password and confirm password do not match");
  }

  try {
    setPasswordLoading(true);

    const res = await axios.put(
      `${API_URL}/users/change-password`,
      passwordData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success(res.data.message);

    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setShowPasswordModal(false);

  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to change password");
  } finally {
    setPasswordLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-5">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">

        {/* Header */}
        <div className="bg-blue-600 py-8 text-center">
          <h1 className="text-3xl font-bold text-white">
            My Profile
          </h1>

          <p className="text-blue-100 mt-2">
            Manage your personal information
          </p>
        </div>

        <div className="p-8">

          {/* Profile Photo */}

          <div className="flex flex-col items-center mb-10">

            <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-blue-500 bg-gray-200 flex items-center justify-center">

              {profileImage ? (
                <img
                  src={URL.createObjectURL(profileImage)}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-6xl">👤</span>
              )}

            </div>

            <label className="mt-4 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition">

              Change Photo

              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />

            </label>

          </div>

          {/* Form */}

          <form
            onSubmit={handleSubmit}
            className="grid md:grid-cols-2 gap-6"
          >

            <div>
              <label className="block mb-2 font-medium">
                First Name
              </label>

              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Last Name
              </label>

              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Phone Number
              </label>

              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2 flex flex-wrap gap-4 mt-4">

              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition disabled:opacity-60"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
<button
  type="button"
  onClick={() => setShowPasswordModal(true)}
  className="bg-gray-800 hover:bg-black text-white px-8 py-3 rounded-lg transition"
>
  Change Password
</button>

            </div>

          </form>

        </div>
      </div>

      {showPasswordModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">

      <h2 className="text-2xl font-bold mb-6">
        Change Password
      </h2>

      <form onSubmit={handlePasswordChange}>

        <div className="mb-4">
          <label className="block mb-2 font-medium">
            Current Password
          </label>

          <input
            type="password"
            value={passwordData.currentPassword}
            onChange={(e) =>
              setPasswordData({
                ...passwordData,
                currentPassword: e.target.value,
              })
            }
            className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-medium">
            New Password
          </label>

          <input
            type="password"
            value={passwordData.newPassword}
            onChange={(e) =>
              setPasswordData({
                ...passwordData,
                newPassword: e.target.value,
              })
            }
            className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2 font-medium">
            Confirm Password
          </label>

          <input
            type="password"
            value={passwordData.confirmPassword}
            onChange={(e) =>
              setPasswordData({
                ...passwordData,
                confirmPassword: e.target.value,
              })
            }
            className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            required

          />
        </div>
                <div className="flex justify-end gap-3">

          <button
            type="button"
            onClick={() => {
              setShowPasswordModal(false);

              setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
              });
            }}
            className="px-5 py-2 rounded-lg border"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={passwordLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg disabled:opacity-60"
          >
            {passwordLoading ? "Changing..." : "Change Password"}
          </button>

        </div>

         </form>

    </div>
  </div>
)}

    </div>
  );
}

export default Profile;