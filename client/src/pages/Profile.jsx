import { API_URL } from "../config";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";

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
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">

        {/* Profile Card with Overlapping Avatar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">

          {/* Gradient Banner */}
          <div className="h-32 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 relative">
            <div className="absolute -bottom-14 left-8">
              <div className="relative">
                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white bg-gray-100 flex items-center justify-center shadow-md">
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
                    <span className="text-5xl">👤</span>
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-orange-500 hover:bg-orange-600 text-white w-9 h-9 rounded-full flex items-center justify-center shadow-md cursor-pointer border-2 border-white transition-colors duration-200">
                  <span className="text-sm">📷</span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Name & Role */}
          <div className="pt-16 pb-6 px-8">
            <h1 className="text-xl font-bold text-gray-900">
              {formData.firstName || "Your"} {formData.lastName || "Name"}
            </h1>
            <p className="text-sm text-gray-500 mt-0.5 capitalize">{user?.role || "user"}</p>
          </div>
        </div>

        {/* Personal Info Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Personal Information</h2>
          <p className="text-sm text-gray-500 mb-6">Update your personal details here</p>

          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-5">

            <div>
              <label className="block mb-1.5 text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white transition-all duration-200"
              />
            </div>

            <div>
              <label className="block mb-1.5 text-sm font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white transition-all duration-200"
              />
            </div>

            <div>
              <label className="block mb-1.5 text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white transition-all duration-200"
              />
            </div>

            <div>
              <label className="block mb-1.5 text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white transition-all duration-200"
              />
            </div>

            <div className="md:col-span-2 flex flex-wrap gap-3 mt-2 pt-4 border-t border-gray-100">
              <button
                type="submit"
                disabled={loading}
                className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-6 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-60"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={() => setShowPasswordModal(true)}
                className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-medium px-6 py-2.5 rounded-xl transition-colors duration-200"
              >
                🔒 Change Password
              </button>
            </div>

          </form>
        </div>

      </div>

      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-7">

            <h2 className="text-xl font-bold mb-1 text-gray-900">Change Password</h2>
            <p className="text-sm text-gray-500 mb-6">Enter your current and new password</p>

            <form onSubmit={handlePasswordChange}>

              <div className="mb-4">
                <label className="block mb-1.5 text-sm font-medium text-gray-700">Current Password</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      currentPassword: e.target.value,
                    })
                  }
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white transition-all duration-200"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block mb-1.5 text-sm font-medium text-gray-700">New Password</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white transition-all duration-200"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block mb-1.5 text-sm font-medium text-gray-700">Confirm Password</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white transition-all duration-200"
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
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="bg-orange-500 hover:bg-orange-600 text-white text-sm px-5 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-60"
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