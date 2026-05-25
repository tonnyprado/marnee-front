import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Lock,
  Bell,
  Globe,
  Trash2,
  Save,
  Camera,
  LogOut,
  Link2,
  CheckCircle,
  Loader2,
  Video,
  BarChart3,
  Music,
  ExternalLink,
} from "lucide-react";
import { getAuthSession, setAuthSession } from "../../services/api";
import PageTransition from "../../Component/PageTransition";
import { useLanguage } from "../../context/LanguageContext";
import LogoutConfirmationModal from "../../Component/LogoutConfirmationModal";
import {
  getInstagramStatus,
  connectInstagram,
  disconnectInstagram,
} from "../../services/instagramApi";
import {
  getGoogleStatus,
  connectGoogle,
  disconnectGoogleService,
  addGoogleService,
} from "../../services/googleApi";
import {
  getTikTokStatus,
  connectTikTok,
  disconnectTikTok,
} from "../../services/tiktokApi";
import { trackSocialConnect, trackSocialDisconnect } from "../../services/facebookPixel";

export default function ProfileSettingsPage() {
  const navigate = useNavigate();
  const session = getAuthSession();
  const { language, setLanguage, languages } = useLanguage();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogout = () => {
    setAuthSession(null);
    window.dispatchEvent(new CustomEvent("app-logout"));
    navigate("/auth");
  };

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

  // Social connections state
  const [connectionsLoading, setConnectionsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [metaStatus, setMetaStatus] = useState(null);
  const [googleStatus, setGoogleStatus] = useState(null);
  const [tiktokStatus, setTiktokStatus] = useState(null);

  // Fetch connection statuses on mount
  useEffect(() => {
    fetchConnectionStatuses();

    // Check for OAuth callback success
    const urlParams = new URLSearchParams(window.location.search);
    if (
      urlParams.get("meta_connected") === "true" ||
      urlParams.get("google_connected") === "true" ||
      urlParams.get("tiktok_connected") === "true"
    ) {
      window.history.replaceState({}, "", window.location.pathname);
      fetchConnectionStatuses();
    }
  }, []);

  const fetchConnectionStatuses = async () => {
    setConnectionsLoading(true);
    try {
      const [metaData, googleData, tiktokData] = await Promise.allSettled([
        getInstagramStatus(),
        getGoogleStatus(),
        getTikTokStatus(),
      ]);

      setMetaStatus(metaData.status === "fulfilled" ? metaData.value : null);
      setGoogleStatus(googleData.status === "fulfilled" ? googleData.value : null);
      setTiktokStatus(tiktokData.status === "fulfilled" ? tiktokData.value : null);
    } catch (error) {
      console.error("Error fetching connection statuses:", error);
    } finally {
      setConnectionsLoading(false);
    }
  };

  // Connection handlers
  const handleInstagramConnect = async () => {
    setActionLoading("instagram");
    try {
      trackSocialConnect("instagram");
      await connectInstagram();
    } catch (error) {
      console.error("Error connecting Instagram:", error);
      setActionLoading(null);
    }
  };

  const handleInstagramDisconnect = async () => {
    if (!window.confirm("Disconnect Instagram? This will remove access to your Instagram data.")) {
      return;
    }
    setActionLoading("instagram");
    try {
      await disconnectInstagram();
      trackSocialDisconnect("instagram");
      await fetchConnectionStatuses();
    } catch (error) {
      console.error("Error disconnecting Instagram:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleYouTubeConnect = async () => {
    setActionLoading("youtube");
    try {
      trackSocialConnect("youtube");
      if (googleStatus?.connected) {
        await addGoogleService("youtube");
      } else {
        await connectGoogle(["youtube"]);
      }
    } catch (error) {
      console.error("Error connecting YouTube:", error);
      setActionLoading(null);
    }
  };

  const handleYouTubeDisconnect = async () => {
    if (!window.confirm("Disconnect YouTube?")) {
      return;
    }
    setActionLoading("youtube");
    try {
      await disconnectGoogleService("youtube");
      trackSocialDisconnect("youtube");
      await fetchConnectionStatuses();
    } catch (error) {
      console.error("Error disconnecting YouTube:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleAnalyticsConnect = async () => {
    setActionLoading("analytics");
    try {
      trackSocialConnect("analytics");
      if (googleStatus?.connected) {
        await addGoogleService("analytics");
      } else {
        await connectGoogle(["analytics"]);
      }
    } catch (error) {
      console.error("Error connecting Google Analytics:", error);
      setActionLoading(null);
    }
  };

  const handleAnalyticsDisconnect = async () => {
    if (!window.confirm("Disconnect Google Analytics?")) {
      return;
    }
    setActionLoading("analytics");
    try {
      await disconnectGoogleService("analytics");
      trackSocialDisconnect("analytics");
      await fetchConnectionStatuses();
    } catch (error) {
      console.error("Error disconnecting Analytics:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleTikTokConnect = () => {
    setActionLoading("tiktok");
    trackSocialConnect("tiktok");
    connectTikTok();
  };

  const handleTikTokDisconnect = async () => {
    if (!window.confirm("Disconnect TikTok? This will remove access to your TikTok data.")) {
      return;
    }
    setActionLoading("tiktok");
    try {
      await disconnectTikTok();
      trackSocialDisconnect("tiktok");
      await fetchConnectionStatuses();
    } catch (error) {
      console.error("Error disconnecting TikTok:", error);
    } finally {
      setActionLoading(null);
    }
  };

  // Define connections for UI
  const connections = [
    {
      id: "instagram",
      name: "Instagram",
      description: "Connect your Instagram Business account for analytics and insights",
      icon: Camera,
      color: "from-purple-600 to-pink-600",
      connected: metaStatus?.connected || false,
      details: metaStatus?.connected
        ? { username: metaStatus.instagramUsername, followers: metaStatus.instagramFollowersCount }
        : null,
      onConnect: handleInstagramConnect,
      onDisconnect: handleInstagramDisconnect,
    },
    {
      id: "youtube",
      name: "YouTube",
      description: "Connect your YouTube channel for video analytics",
      icon: Video,
      color: "from-red-600 to-red-700",
      connected: googleStatus?.connected && googleStatus?.connectedServices?.includes("youtube"),
      details: googleStatus?.youtubeChannel
        ? { channelName: googleStatus.youtubeChannel.channelName, subscribers: googleStatus.youtubeChannel.subscriberCount }
        : null,
      onConnect: handleYouTubeConnect,
      onDisconnect: handleYouTubeDisconnect,
    },
    {
      id: "tiktok",
      name: "TikTok",
      description: "Connect your TikTok account for content performance",
      icon: Music,
      color: "from-gray-900 to-gray-800",
      connected: tiktokStatus?.connected || false,
      details: tiktokStatus?.connected
        ? { username: tiktokStatus.username, followers: tiktokStatus.followersCount }
        : null,
      onConnect: handleTikTokConnect,
      onDisconnect: handleTikTokDisconnect,
    },
    {
      id: "analytics",
      name: "Google Analytics",
      description: "Connect Google Analytics 4 for website traffic insights",
      icon: BarChart3,
      color: "from-orange-600 to-amber-600",
      connected: googleStatus?.connected && googleStatus?.connectedServices?.includes("analytics"),
      details: googleStatus?.googleAnalytics
        ? { propertyName: googleStatus.googleAnalytics.propertyName }
        : null,
      onConnect: handleAnalyticsConnect,
      onDisconnect: handleAnalyticsDisconnect,
    },
  ];

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

          {/* Connected Accounts */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#40086d] rounded-full flex items-center justify-center">
                <Link2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Connected Accounts</h2>
                <p className="text-sm text-gray-500">Manage your social media and analytics connections</p>
              </div>
            </div>

            {connectionsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-[#40086d]" />
                <span className="ml-3 text-gray-500">Loading connections...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {connections.map((connection) => {
                  const Icon = connection.icon;
                  const isLoading = actionLoading === connection.id;

                  return (
                    <div
                      key={connection.id}
                      className={`
                        relative p-4 rounded-xl border-2 transition-all
                        ${connection.connected
                          ? "bg-green-50 border-green-200"
                          : "bg-gray-50 border-gray-200 hover:border-gray-300"
                        }
                      `}
                    >
                      {/* Connected badge */}
                      {connection.connected && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-sm">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                      )}

                      <div className="flex items-start gap-3">
                        {/* Icon */}
                        <div
                          className={`w-11 h-11 rounded-xl bg-gradient-to-br ${connection.color} flex items-center justify-center text-white flex-shrink-0 shadow-sm`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900">{connection.name}</h3>
                          {connection.connected && connection.details ? (
                            <div className="text-sm text-gray-600 mt-0.5">
                              {connection.details.username && (
                                <span>@{connection.details.username}</span>
                              )}
                              {connection.details.channelName && (
                                <span>{connection.details.channelName}</span>
                              )}
                              {connection.details.propertyName && (
                                <span>{connection.details.propertyName}</span>
                              )}
                              {(connection.details.followers || connection.details.subscribers) && (
                                <span className="text-gray-400 ml-2">
                                  • {(connection.details.followers || connection.details.subscribers)?.toLocaleString()} followers
                                </span>
                              )}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">
                              {connection.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Action button */}
                      <div className="mt-3 flex justify-end">
                        {connection.connected ? (
                          <button
                            onClick={connection.onDisconnect}
                            disabled={isLoading}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          >
                            {isLoading ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <ExternalLink className="w-4 h-4" />
                            )}
                            Disconnect
                          </button>
                        ) : (
                          <button
                            onClick={connection.onConnect}
                            disabled={isLoading}
                            className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-gradient-to-r ${connection.color} rounded-lg hover:shadow-md transition-all disabled:opacity-50`}
                          >
                            {isLoading ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Link2 className="w-4 h-4" />
                            )}
                            Connect
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Info note */}
            <p className="mt-4 text-xs text-gray-400">
              Marnee only accesses read-only data to provide analytics and insights. You can disconnect any account at any time.
            </p>
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

          {/* Sign Out */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <LogOut className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Sign Out</h2>
                  <p className="text-sm text-gray-500">Log out of your account on this device</p>
                </div>
              </div>
              <button
                onClick={() => setIsLogoutModalOpen(true)}
                className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Sign Out
              </button>
            </div>
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

      {/* Logout Confirmation Modal */}
      <LogoutConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />
    </PageTransition>
  );
}
