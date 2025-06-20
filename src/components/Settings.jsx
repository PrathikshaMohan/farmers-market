import { useState } from "react";

const Settings = () => {
 
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });


  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profileImage") {
      setProfileImage(files[0]);
      setPreviewImage(URL.createObjectURL(files[0]));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

 const handleSubmit = async (e) => {
   const BASE_URL = import.meta.env.VITE_API_URL;
  e.preventDefault();

  if (formData.password && formData.password !== formData.confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/api/user/update-profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        password: formData.password || null,
      }),
    });

    const data = await response.json();
    alert(data.message);

    // Clear the form after successful update
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setPreviewImage(null); // if you're using image preview, this clears it too
  } catch (error) {
    console.error("Update failed:", error);
    alert("An error occurred.");
  }
};


  return (
    <div className="w-full max-w-3xl mx-auto bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 transition-all duration-300">
  <h2 className="text-3xl font-extrabold mb-6 text-[rgb(128,153,11)] flex items-center gap-2">
     Profile Settings
  </h2>

  <form onSubmit={handleSubmit} className="space-y-6">
    <div>
      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
        Full Name
      </label>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Enter your full name"
        className="w-full border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[rgb(128,153,11)]"
        required
      />
    </div>

    <div>
      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
        Email
      </label>
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="example@domain.com"
        className="w-full border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[rgb(128,153,11)]"
        required
      />
    </div>

    <div>
      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
        New Password
      </label>
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="••••••••"
        className="w-full border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[rgb(128,153,11)]"
      />
    </div>

    <div>
      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
        Confirm Password
      </label>
      <input
        type="password"
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleChange}
        placeholder="••••••••"
        className="w-full border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[rgb(128,153,11)]"
      />
    </div>

    <div className="text-right">
      <button
        type="submit"
        className="inline-block bg-[rgb(128,153,11)] hover:bg-[rgb(100,120,10)] text-white font-medium px-6 py-2 rounded-lg transition duration-200 transform hover:scale-105"
      >
         Save Changes
      </button>
    </div>
  </form>
</div>

  );
};

export default Settings;
