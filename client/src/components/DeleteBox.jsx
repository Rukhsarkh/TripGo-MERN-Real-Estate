const DeleteBox = ({
  setIsOpenDeleteDialogue,
  handleDeleteUserConfirm,
  isDeleting,
}) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center 
          bg-black bg-opacity-50 backdrop-blur-sm"
      onClick={() => setIsOpenDeleteDialogue(false)}
    >
      <div
        className="bg-white p-6 w-full max-w-md shadow-2xl"
        onClick={(e) => e.stopPropagation()} //so that parent's onclick won't get trigerred
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Confirm Deletion
        </h2>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete this list? This action cannot be
          undone.
        </p>

        <div className="flex justify-end space-x-4">
          <button
            onClick={() => setIsOpenDeleteDialogue(false)}
            disabled={isDeleting}
            className="px-4 py-2 border border-gray-300 
                hover:bg-gray-100 transition-colors 
                disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteUserConfirm}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-500 text-white 
                hover:bg-red-600 transition-colors 
                disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteBox;
