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

const DesktopAccount = ({
  username,
  email,
  avatar,
  activeTab,
  setActiveTab,
  listings,
  handleEditProfile,
  setIsOpenDeleteDialogue,
  handleLogout,
}) => {
  return (
    <div className="hidden lg:block h-full">
      <div className="h-1/2 grid grid-cols-12 gap-6 lg:pt-20">
        {/* Column 1: Header Section (3 columns) */}
        <div className="col-span-3 bg-white shadow-xl rounded-l-2xl">
          <div className="h-20 bg-primary rounded-tl-2xl"></div>
          <div className="p-6 flex flex-col items-center text-center">
            <div className="relative mb-4 -mt-12 hover:scale-95 hover:transition-all hover:duration-200 hover:ease-in-out hover:cursor-pointer">
              <img
                src={
                  avatar ||
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyalF0xYA7hTJuxVhMvkkk2WMFiHjP-raN7w&s"
                }
                alt="Profile"
                className="w-24 h-24 rounded-full border-4 border-white shadow-xl object-cover"
              />
              <div className="absolute bottom-4 right-4 w-5 h-5">
                <Edit3 />
              </div>
            </div>

            <h1 className="text-xl font-bold text-gray-900 mb-2">{username}</h1>
            <p className="text-sm text-gray-600 mb-4">
              Property Enthusiast • {listings.length} Listings
            </p>

            <div className="space-y-2 w-full">
              <button
                className="w-full flex items-center justify-center gap-2 bg-primary text-white px-4 py-2 hover:shadow-lg transition-all"
                onClick={() => navigate("/new-form")}
              >
                <Plus size={16} />
                Create Listing
              </button>
              <button
                className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 transition-all"
                onClick={handleEditProfile}
              >
                <Edit3 size={16} />
                Edit Profile
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex w-full mt-6 bg-gray-100 p-1">
              {[
                { id: "profile", label: "Profile", icon: User },
                { id: "listings", label: "Listings", icon: Home },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium transition-all ${
                    activeTab === id
                      ? "bg-white text-primary shadow-xl"
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

        {/* Column 2: Main Content Area (6 columns) */}
        <div className="col-span-6 bg-white shadow-xl overflow-hidden">
          <div className="h-full flex flex-col">
            {activeTab === "profile" && (
              <div className="p-6 overflow-y-auto">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Profile Information
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-gray-50">
                    <div className="bg-red-50 p-3">
                      <User className="text-primary" size={40} />
                    </div>
                    <div className="flex-1">
                      <label className="text-sm font-medium text-gray-700">
                        Full Name
                      </label>
                      <p className="text-gray-900 font-thin text-lg">
                        {username}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-gray-50">
                    <div className="bg-red-50 p-3">
                      <Mail className="text-primary" size={40} />
                    </div>
                    <div className="flex-1">
                      <label className="text-sm font-medium text-gray-700">
                        Email Address
                      </label>
                      <p className="text-gray-900 font-thin text-lg">{email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-gray-50">
                    <div className="bg-red-50 p-3">
                      <Lock className="text-primary" size={40} />
                    </div>
                    <div className="flex-1">
                      <label className="text-sm font-medium text-gray-700">
                        Password
                      </label>
                      <p className="text-gray-900 font-thin text-lg">
                        •••••••••••
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "listings" && (
              <div className="p-6 flex flex-col h-full">
                <div className="flex justify-between items-center mb-6 flex-shrink-0">
                  <h2 className="text-xl font-bold text-gray-900">
                    My Listings ({listings.length})
                  </h2>
                  <button
                    className="flex items-center gap-2 bg-primary text-white px-4 py-2 hver:shadow-lg transition-all"
                    onClick={() => navigate("/new-form")}
                  >
                    <Plus size={16} />
                    New Listing
                  </button>
                </div>

                {/* Scrollable Listings Area */}

                {listings.length === 0 ? (
                  "No Listings Created"
                ) : (
                  <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                    {listings.map((listing) => (
                      <div
                        key={listing._id}
                        className="bg-gray-50 overflow-hidden hover:shadow-lg transition-all"
                      >
                        <div className="flex">
                          <div className="w-48 flex-shrink-0 p-1">
                            <img
                              src={listing.image.url}
                              alt={listing.title}
                              className="w-full h-32 object-cover rounded"
                            />
                          </div>
                          <div className="flex-1 p-4">
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex-1">
                                <h3 className="font-bold text-gray-900 mb-1">
                                  {listing.title}
                                </h3>
                                <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                                  <MapPin
                                    size={14}
                                    className="text-emerald-400"
                                  />
                                  <span>{listing.location}</span>
                                </div>
                              </div>
                              <span
                                className={`px-3 py-1 text-sm ${
                                  listing.type === "Sale"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-50 text-primary"
                                }`}
                              >
                                {listing.type}
                              </span>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1">
                                <DollarSign
                                  size={16}
                                  className="text-emerald-400"
                                />
                                <span className="font-bold text-emerald-400">
                                  {listing.price}
                                </span>
                              </div>
                              <div className="flex gap-2">
                                <button className="flex items-center gap-1 bg-red-50 text-primary px-3 py-1 hover:bg-blue-200 transition-colors text-sm">
                                  <Eye size={14} />
                                  View
                                </button>
                                <button className="flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1 hover:bg-gray-200 transition-colors text-sm">
                                  <Edit3 size={14} />
                                  Edit
                                </button>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-1 mt-2">
                              {listing.amenities.map((amenity) => (
                                <span
                                  key={amenity}
                                  className="px-2 py-1 bg-white text-gray-700 text-xs"
                                >
                                  {amenity}
                                </span>
                              ))}
                            </div>
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

        {/* Column 3: Sidebar (3 columns) */}
        <div className="col-span-3 space-y-6">
          {/* Quick Stats */}
          <div className="bg-white shadow-xl p-6 rounded-tr-2xl ">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Quick Stats
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Listings</span>
                <span className="font-thin text-lg px-2 rounded-full bg-gray-100">
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
          <div className="bg-white shadow-xl p-6 rounded-br-2xl">
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
                className="w-full flex items-center gap-3 text-left p-3 hover:bg-red-50 text-primary transition-colors"
                onClick={() => setIsOpenDeleteDialogue(true)}
              >
                <Trash2 size={16} />
                <span>Delete Account</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopAccount;
