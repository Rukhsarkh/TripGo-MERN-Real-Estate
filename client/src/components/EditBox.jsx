import { Eye, EyeOff, Save, X } from "lucide-react";
import { useRef } from "react";

const EditBox = ({
  setIsEditModalOpen,
  handleEditFormChange,
  handleEditSubmit,
  showNewPassword,
  setShowNewPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  isUpdating,
  editErrors,
  editForm,
  handleImageChange,
  avatar,
}) => {
  const fileRef = useRef(null);
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md max-h-[90vh] overflow-y-auto lg:p-5">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between z-50">
          <h2 className="text-xl font-bold text-gray-900">Edit Profile</h2>
          <button
            onClick={() => setIsEditModalOpen(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleEditSubmit} className="p-4 space-y-4">
          {editErrors.general && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-md text-sm">
              {editErrors.general}
            </div>
          )}

          <div>
            <input
              onChange={handleImageChange}
              type="file"
              ref={fileRef}
              hidden
              accept="image/*"
            />
            <img
              onClick={() => fileRef.current.click()}
              src={
                editForm.avatarPreview ||
                avatar ||
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyalF0xYA7hTJuxVhMvkkk2WMFiHjP-raN7w&s"
              }
              alt="profile"
              className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
            />
            {editErrors.username && (
              <p className="text-red-600 text-xs mt-1">{editErrors.avatar}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={editForm.username}
              onChange={handleEditFormChange}
              className={`w-full px-3 py-2 border focus:outline-none  ${
                editErrors.username ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Enter your username"
            />
            {editErrors.username && (
              <p className="text-red-600 text-xs mt-1">{editErrors.username}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={editForm.email}
              onChange={handleEditFormChange}
              className={`w-full px-3 py-2 border outline-none ${
                editErrors.email ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Enter your email"
            />
            {editErrors.email && (
              <p className="text-red-600 text-xs mt-1">{editErrors.email}</p>
            )}
          </div>

          <div className="border-t pt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Change Password (Optional)
            </h3>

            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  value={editForm.newPassword}
                  onChange={handleEditFormChange}
                  className={`w-full px-3 py-2 border focus:outline-nonepr-10 ${
                    editErrors.newPassword
                      ? "border-red-300"
                      : "border-gray-300"
                  }`}
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {editErrors.newPassword && (
                <p className="text-red-600 text-xs mt-1">
                  {editErrors.newPassword}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={editForm.confirmPassword}
                  onChange={handleEditFormChange}
                  className={`w-full px-3 py-2 border focus:outline-none pr-10 ${
                    editErrors.confirmPassword
                      ? "border-red-300"
                      : "border-gray-300"
                  }`}
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
              </div>
              {editErrors.confirmPassword && (
                <p className="text-red-600 text-xs mt-1">
                  {editErrors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              disabled={isUpdating}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary text-white rounded-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              disabled={isUpdating}
            >
              {isUpdating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Updating...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBox;
