import React, { useState } from "react";
import { User, Lock, Bell, Globe, Trash2, Save, Camera } from "lucide-react";
import { getAuthSession } from "../../services/api";
import PageTransition from "../../Component/PageTransition";
import { useLanguage } from "../../context/LanguageContext";

export default function ProfileSettingsPage() {
  const session = getAuthSession();
  const { language, setLanguage, languages } = useLanguage();

  // Hardcoded data - will be replaced with real data later
  const [profileData, setProfileData] = useState({
    name: session?.name || "Sarah Johnson",
    email: session?.email || "sarah.johnson@example.com",
    phone: "+1 (555) 123-4567",
    company: "Marnee Agency",
    bio: "Digital marketing specialist passionate about creating engaging content.",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    marketingEmails: false,
    weeklyDigest: true,
  });

  const handleProfileChange = (field, value) => {
    setProfileData({ ...profileData, [field]: value });
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData({ ...passwordData, [field]: value });
  };

  const handlePreferenceChange = (field, value) => {
    setPreferences({ ...preferences, [field]: value });
  };

  const handleSaveProfile = () => {
    // TODO: API call to save profile
    console.log("Saving profile:", profileData);
  };

  const handleChangePassword = () => {
    // TODO: API call to change password
    console.log("Changing password");
  };

  const handleSavePreferences = () => {
    // TODO: API call to save preferences
    console.log("Saving preferences:", preferences);
  };

  return (
    <PageTransition className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
          <p className="text-gray-500">Manage your account settings and preferences</p>
        </div>

        <div className="space-y-6">
          {/* Profile Information */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#40086d] rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
                <p className="text-sm text-gray-500">Update your personal details</p>
              </div>
            </div>

            {/* Profile Photo */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Profile Photo</label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-[#40086d] rounded-full flex items-center justify-center text-white text-2xl font-medium">
                  {profileData.name.split(" ").map(n => n[0]).join("")}
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-[#ede0f8] text-[#40086d] rounded-lg hover:bg-[#dccaf4] transition-colors font-medium text-sm">
                  <Camera className="w-4 h-4" />
                  Change Photo
                </button>
              </div>
            </div>

            {/* Form Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => handleProfileChange("name", e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40086d] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => handleProfileChange("email", e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40086d] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => handleProfileChange("phone", e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40086d] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                <input
                  type="text"
                  value={profileData.company}
                  onChange={(e) => handleProfileChange("company", e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40086d] focus:border-transparent"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
              <textarea
                value={profileData.bio}
                onChange={(e) => handleProfileChange("bio", e.target.value)}
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40086d] focus:border-transparent resize-none"
              />
            </div>

            <button
              onClick={handleSaveProfile}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#40086d] text-white rounded-lg hover:bg-[#5a0a9d] transition-colors font-medium"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>

          {/* Change Password */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#40086d] rounded-full flex items-center justify-center">
                <Lock className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Change Password</h2>
                <p className="text-sm text-gray-500">Update your password regularly for security</p>
              </div>
            </div>

            <div className="space-y-4 mb-6 max-w-md">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => handlePasswordChange("currentPassword", e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40086d] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40086d] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40086d] focus:border-transparent"
                />
              </div>
            </div>

            <button
              onClick={handleChangePassword}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#40086d] text-white rounded-lg hover:bg-[#5a0a9d] transition-colors font-medium"
            >
              <Lock className="w-4 h-4" />
              Update Password
            </button>
          </div>

          {/* Preferences */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#40086d] rounded-full flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Preferences</h2>
                <p className="text-sm text-gray-500">Customize your experience</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              {/* Language */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full md:w-64 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40086d] focus:border-transparent"
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.flag} {lang.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Notifications */}
              <div className="space-y-3 pt-4">
                <div className="flex items-center gap-3 mb-2">
                  <Bell className="w-5 h-5 text-gray-600" />
                  <h3 className="text-sm font-semibold text-gray-900">Notification Settings</h3>
                </div>

                <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                  <span className="text-sm text-gray-700">Email Notifications</span>
                  <input
                    type="checkbox"
                    checked={preferences.emailNotifications}
                    onChange={(e) => handlePreferenceChange("emailNotifications", e.target.checked)}
                    className="w-5 h-5 text-[#40086d] rounded focus:ring-2 focus:ring-[#40086d]"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                  <span className="text-sm text-gray-700">Marketing Emails</span>
                  <input
                    type="checkbox"
                    checked={preferences.marketingEmails}
                    onChange={(e) => handlePreferenceChange("marketingEmails", e.target.checked)}
                    className="w-5 h-5 text-[#40086d] rounded focus:ring-2 focus:ring-[#40086d]"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                  <span className="text-sm text-gray-700">Weekly Digest</span>
                  <input
                    type="checkbox"
                    checked={preferences.weeklyDigest}
                    onChange={(e) => handlePreferenceChange("weeklyDigest", e.target.checked)}
                    className="w-5 h-5 text-[#40086d] rounded focus:ring-2 focus:ring-[#40086d]"
                  />
                </label>
              </div>
            </div>

            <button
              onClick={handleSavePreferences}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#40086d] text-white rounded-lg hover:bg-[#5a0a9d] transition-colors font-medium"
            >
              <Save className="w-4 h-4" />
              Save Preferences
            </button>
          </div>

          {/* Danger Zone */}
          <div className="bg-white rounded-2xl p-6 border border-red-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Danger Zone</h2>
                <p className="text-sm text-gray-500">Irreversible actions</p>
              </div>
            </div>

            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-1">Delete Account</h3>
              <p className="text-sm text-gray-600 mb-4">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium text-sm">
                Delete My Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
