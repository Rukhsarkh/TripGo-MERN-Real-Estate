const SearchForm = ({ handleSubmit, handleOnChange, sidebarValues }) => {
  return (
    <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
      <div className="flex gap-2 flex-wrap items-center">
        <div className="flex items-center gap-2">
          <label className="whitespace-nowrap font-semibold">Search</label>
          <input
            type="text"
            id="searchTerm"
            placeholder="Search By Name..."
            className="border p-3 w-full outline-none"
            onChange={handleOnChange}
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="whitespace-nowrap font-semibold">Country</label>
          <input
            type="text"
            id="country"
            placeholder="Country"
            className="border p-3 w-full outline-none"
            onChange={handleOnChange}
          />
        </div>
      </div>
      <div className="flex gap-2 flex-wrap items-center">
        <label className="font-semibold">Type:</label>
        <div className="flex gap-2">
          <input
            type="checkbox"
            id="all"
            className="w-5"
            onChange={handleOnChange}
            checked={sidebarValues.type === "all"}
          />
          <span>All</span>
        </div>
        <div className="flex gap-2">
          <input
            type="checkbox"
            id="Rent"
            className="w-5"
            onChange={handleOnChange}
            checked={sidebarValues.type === "Rent"}
          />
          <span>Rent</span>
        </div>
        <div className="flex gap-2">
          <input
            type="checkbox"
            id="Sale"
            className="w-5"
            onChange={handleOnChange}
            checked={sidebarValues.type === "Sale"}
          />
          <span>Sale</span>
        </div>
      </div>
      <div className="flex gap-2 max-xl:flex-wrap items-center">
        <label className="font-semibold">Amenities:</label>
        <div className="flex gap-2">
          <input
            type="checkbox"
            id="parking"
            className="w-5"
            onChange={handleOnChange}
          />
          <span>Parking</span>
        </div>
        <div className="flex gap-2">
          <input
            type="checkbox"
            id="furnished"
            className="w-5"
            onChange={handleOnChange}
          />
          <span>Furnished</span>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <label className="font-semibold">Sort:</label>
        <select
          id="sort_order"
          className="border p-3 outline-none"
          // defaultValue={"createdAt_asc"} // Default to oldest first
          onChange={handleOnChange}
          value={`${sidebarValues.sort_order}_${sidebarValues.order}`}
        >
          <option value="regularPrice_asc">Price low to high</option>
          <option value="regularPrice_desc">Price high to low</option>
          <option value="createdAt_desc">Latest (newest first)</option>
          <option value="createdAt_asc">Oldest (oldest first)</option>
        </select>
      </div>
      <button
        className="bg-primary text-white py-2 text-lg hover:opacity-95 active:translate-y-0.5 
              transition-all duration-300 ease-in-out"
      >
        Search
      </button>
    </form>
  );
};

export default SearchForm;
