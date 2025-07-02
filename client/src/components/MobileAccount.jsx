import {
  Edit3,
  Home,
  Lock,
  LogOut,
  Mail,
  Plus,
  Trash2,
  User,
} from "lucide-react";

const MobileAccount = ({
  username,
  email,
  avatar,
  activeTab,
  setActiveTab,
  listings,
  handleEditProfile,
  setIsOpenDeleteDialogue,
  handleLogout,
  navigate,
}) => {
  return (
    <div className=" flex flex-col lg:hidden gap-16 pt-8">
      {/* Mobile Header */}
      <div className="bg-white shadow-xl mb-4 overflow-hidden rounded-xl">
        <div className="h-24 bg-primary"></div>
        <div className="p-4">
          <div className="flex items-center mb-4">
            <div className="relative mr-4">
              <img
                src={
                  avatar ||
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyalF0xYA7hTJuxVhMvkkk2WMFiHjP-raN7w&s"
                }
                alt="Profile"
                className="w-24 h-24 rounded-full border-4 border-primary shadow-xl object-cover"
              />
              <div className="absolute bottom-4 right-4 w-4 h-4">
                <Edit3 />
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-lg font-bold text-gray-900">{username}</h1>
              <p className="text-sm text-gray-600">
                Property Enthusiast • {listings.length || 0}
              </p>
            </div>
          </div>

          <div className="space-y-2 w-full mb-1">
            <button
              className="w-full flex items-center justify-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 transition-all"
              onClick={handleEditProfile}
            >
              <Edit3 size={16} />
              Edit Profile
            </button>
          </div>

          {/* Mobile Tabs */}
          <div className="flex bg-gray-100 p-1 mb-4">
            {[
              { id: "profile", label: "Profile", icon: User },
              { id: "listings", label: "Listings", icon: Home },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium transition-all ${
                  activeTab === id
                    ? "bg-white text-primary shadow-lg"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Content */}
      <div className="flex-1 bg-white shadow-xl overflow-hidden rounded-xl">
        <div className="h-[calc(100vh-20rem)] flex flex-col">
          {activeTab === "profile" && (
            <div className="p-4 overflow-y-auto">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Profile Information
              </h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 ">
                  <div className="bg-red-50 p-2">
                    <User className="text-primary" size={30} />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs font-medium text-gray-700">
                      Full Name
                    </label>
                    <p className="text-gray-900 font-thin">{username}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50">
                  <div className="bg-red-50 p-2">
                    <Mail className="text-primary" size={30} />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs font-medium text-gray-700">
                      Email Address
                    </label>
                    <p className="text-gray-900 font-thin">{email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50">
                  <div className="bg-red-50 p-2">
                    <Lock className="text-primary" size={30} />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs font-medium text-gray-700">
                      Password
                    </label>
                    <p className="text-gray-900 font-thin">•••••••••</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "listings" && (
            <div className="p-4 flex flex-col h-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-900">
                  My Listings ({listings.length})
                </h2>
                <button className="flex items-center gap-1 bg-primary text-white px-3 py-1 text-sm">
                  <Plus size={14} />
                  New
                </button>
              </div>

              {listings.length === 0 ? (
                "No Listings Created"
              ) : (
                <div className="flex-1 overflow-y-auto space-y-3">
                  {listings.map((listing) => (
                    <div
                      key={listing._id}
                      className="bg-gray-50 overflow-hidden"
                    >
                      <div className="flex">
                        <div
                          className="w-36 flex-shrink-0 p-1"
                          onClick={() => navigate(`/show-list/${listing._id}`)}
                        >
                          <img
                            src={listing.image.url}
                            alt={listing.title}
                            className="w-full h-24 object-cover rounded"
                          />
                        </div>
                        <div className="flex-1 p-3">
                          <h3 className="font-bold text-sm text-gray-900 mb-1">
                            {listing.title}
                          </h3>
                          <p className="text-xs text-gray-600 mb-1">
                            {listing.location}
                          </p>
                          <p className="font-bold text-primary text-sm">
                            ${listing.price.toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Column 3: Sidebar */}
      <div className="flex-1 space-y-6 my-10">
        {/* Quick Stats */}
        <div className="bg-white shadow-xl p-6 rounded-xl">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Stats</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Listings</span>
              <span className=" font-thin text-lg px-2 rounded-full bg-gray-100">
                {listings.length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">For Sale</span>
              <span className="font-thin text-lg px-2 rounded-full bg-gray-100">
                {listings.filter((l) => l.type === "Sale").length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">For Rent</span>
              <span className="font-thin text-lg px-2 rounded-full bg-gray-100">
                {listings.filter((l) => l.type === "Rent").length}
              </span>
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="bg-white shadow-xl p-6 rounded-xl">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Account Actions
          </h3>
          <div className="space-y-3">
            <button
              className="w-full flex items-center gap-3 text-left p-3 hover:bg-gray-50 transition-colors"
              onClick={handleLogout}
            >
              <LogOut size={16} className="text-gray-600" />
              <span>Log Out</span>
            </button>
            <button
              className="w-full flex items-center gap-3 text-left p-3 hover:bg-red-50 text-red-600 transition-colors"
              onClick={() => setIsOpenDeleteDialogue(true)}
            >
              <Trash2 size={16} />
              <span>Delete Account</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileAccount;
