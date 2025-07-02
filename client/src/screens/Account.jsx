import { useEffect, useState } from "react";
import config from "../config";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import DeleteBox from "../components/DeleteBox";
import EditBox from "../components/EditBox";
import MobileAccount from "../components/MobileAccount";
import DesktopAccount from "../components/DesktopAccount";

const Account = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [listings, setListings] = useState([]);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const [userId, setUserId] = useState("");
  const [isOpenDeleteDialogue, setIsOpenDeleteDialogue] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [editForm, setEditForm] = useState({
    username: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    avatar: "",
    avatarPreview: "",
  });

  const [editErrors, setEditErrors] = useState({});
  const { logout } = useAuth();

  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      navigate("/login");
    }
  };

  const handleDeleteUserConfirm = async () => {
    try {
      setIsDeleting(true);
      // console.log(userId);
      const res = await axios.delete(
        `${config.API_URL}/user/deleteUser/${userId}`,
        { withCredentials: true }
      );

      setIsOpenDeleteDialogue(false);
      setIsDeleting(false);
      setTimeout(() => {
        navigate("/explore");
        window.location.reload();
      }, 900);
    } catch (error) {
      console.error("Error Deleting User:", error);
    }
  };

  const handleEditProfile = () => {
    setIsEditModalOpen(true);
    setEditForm({
      username: username,
      email: email,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      avatar: null,
      avatarPreview: avatar,
    });
    setEditErrors({});
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user starts typing
    if (editErrors[name]) {
      setEditErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
      if (!validTypes.includes(file.type)) {
        setEditErrors((prev) => ({
          ...prev,
          avatar: "Please select a valid image file (JPEG, PNG, or GIF)",
        }));
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setEditErrors((prev) => ({
          ...prev,
          avatar: "Image size should be less than 5MB",
        }));
        return;
      }

      // Clear any previous error
      setEditErrors((prev) => ({
        ...prev,
        avatar: "",
      }));

      // preview
      const previewUrl = URL.createObjectURL(file);

      setEditForm((prev) => ({
        ...prev,
        avatar: file,
        avatarPreview: previewUrl,
      }));
    }
  };

  //cleanup function
  useEffect(() => {
    return () => {
      if (editForm.avatarPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(editForm.avatarPreview);
      }
    };
  }, [editForm.avatarPreview]);

  const validateConfig = () => {
    const errors = {};

    if (!editForm.username.trim()) {
      errors.username = "Username is required";
    }

    if (!editForm.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(editForm.email)) {
      errors.email = "Email is invalid";
    }

    if (editForm.newPassword || editForm.confirmPassword) {
      if (!editForm.newPassword) {
        errors.newPassword = "New password is required";
      } else if (editForm.newPassword.length < 6) {
        errors.newPassword = "New password must be at least 6 characters";
      }

      if (editForm.newPassword !== editForm.confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
      }
    }

    return errors;
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    const errors = validateConfig();
    if (Object.keys(errors).length > 0) {
      setEditErrors(errors);
      return;
    }

    try {
      setIsUpdating(true);

      const formData = new FormData();
      formData.append("username", editForm.username);
      formData.append("email", editForm.email);

      // Only include password fields if user wants to change password
      if (editForm.newPassword) {
        formData.append("currentPassword", editForm.currentPassword);
        formData.append("newPassword", editForm.newPassword);
      }

      // image if selected
      if (editForm.avatar) {
        formData.append("avatar", editForm.avatar);
      }

      const response = await axios.put(
        `${config.API_URL}/user/update-profile/${userId}`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        // Update local state with new values
        setUsername(editForm.username);
        setEmail(editForm.email);

        // Update avatar if new one was uploaded
        if (response.data.avatar) {
          setAvatar(response.data.avatar);
        }

        // Clean up preview URL
        if (
          editForm.avatarPreview &&
          editForm.avatarPreview.startsWith("blob:")
        ) {
          URL.revokeObjectURL(editForm.avatarPreview);
        }

        setIsEditModalOpen(false);
        alert("Profile updated successfully!");
      } else {
        setEditErrors({ general: response.data.message || "Update failed" });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      if (error.response?.data?.message) {
        setEditErrors({ general: error.response.data.message });
      } else {
        setEditErrors({ general: "An error occurred while updating profile" });
      }
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`${config.API_URL}/user/get-profile`, {
          withCredentials: true,
        });
        // console.log(response.data);
        setUsername(response.data.username);
        setEmail(response.data.email);
        setAvatar(response.data.avatar);
        setUserId(response.data.userId);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchLoggedInUserListings = async () => {
      try {
        const response = await axios.get(
          `${config.API_URL}/api/listings/getUserListings/${userId}`,
          {
            withCredentials: true,
          }
        );

        // console.log(response.data);
        const { success, message, listings } = response.data;

        if (success) {
          setListings(listings || []);
        } else {
          console.warn("Error from server:", message);
          setListings([]);
        }
      } catch (error) {
        console.error("Error fetching Listings", error);
        setListings([]);
      }
    };

    fetchLoggedInUserListings();
  }, [userId]);

  return (
    <>
      <div className="min-h-screen bg-[radial-gradient(circle_at_50%_120%,rgba(239,68,68,0.1),rgba(156,163,175,0.1))] pt-60 lg:pt-28">
        <div className="h-[calc(100vh-5rem)] lg:h-[calc(100vh-7rem)] px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 lg:pb-8">
          <div className="h-full max-w-7xl mx-auto">
            <MobileAccount
              username={username}
              email={email}
              avatar={avatar}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              listings={listings}
              handleEditProfile={handleEditProfile}
              setIsOpenDeleteDialogue={setIsOpenDeleteDialogue}
              handleLogout={handleLogout}
            />

            <DesktopAccount
              username={username}
              email={email}
              avatar={avatar}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              listings={listings}
              handleEditProfile={handleEditProfile}
              setIsOpenDeleteDialogue={setIsOpenDeleteDialogue}
              handleLogout={handleLogout}
            />
          </div>
        </div>
      </div>

      {isEditModalOpen && (
        <EditBox
          setIsEditModalOpen={setIsEditModalOpen}
          handleEditFormChange={handleEditFormChange}
          handleEditSubmit={handleEditSubmit}
          showNewPassword={showNewPassword}
          showConfirmPassword={showConfirmPassword}
          isUpdating={isUpdating}
          editErrors={editErrors}
          editForm={editForm}
          setShowNewPassword={setShowNewPassword}
          setShowConfirmPassword={setShowConfirmPassword}
          handleImageChange={handleImageChange}
          avatar={avatar}
        />
      )}

      {isOpenDeleteDialogue && (
        <DeleteBox
          setIsOpenDeleteDialogue={setIsOpenDeleteDialogue}
          handleDeleteUserConfirm={handleDeleteUserConfirm}
          isDeleting={isDeleting}
        />
      )}
    </>
  );
};

export default Account;
