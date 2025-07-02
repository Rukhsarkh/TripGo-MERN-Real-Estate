import { useNavigate } from "react-router-dom";

const UserOptions = ({ isLoggedIn, logout }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      navigate("/login");
    }
  };

  return (
    <div className="absolute right-0 top-12 bg-white shadow-lg rounded-lg p-4 w-60 ">
      {isLoggedIn ? (
        <div>
          <div className="flex flex-col gap-2">
            <button
              className="hover:bg-gray-100 py-2 px-4 rounded-md text-left transition-colors"
              onClick={() => {
                navigate("/account");
              }}
            >
              Account
            </button>
            <button
              className="hover:bg-gray-100 py-2 px-4 rounded-md text-left transition-colors"
              onClick={handleLogout}
            >
              LogOut
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex flex-col gap-2">
            <button
              className="hover:bg-gray-100 py-2 px-4 rounded-md text-left transition-colors"
              onClick={() => navigate("/sign-up")}
            >
              Signup
            </button>
            <button
              className="hover:bg-gray-100 py-2 px-4 rounded-md text-left transition-colors"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserOptions;
