import React from "react";
import { CiSearch } from "react-icons/ci";

const Search = ({ onSearch }) => {
  return (
    <div className="flex justify-center bg-[#F4F5F8] ">
      <div className="relative w-full max-w-screen-sm px-5 mb-2 mt-2">
        <div className="flex items-center justify-end mt-2 w-full">
          <div className="relative w-full">
            <CiSearch className="absolute left-[14px] top-1/2 transform -translate-y-1/2 text-black text-[18px]" />
            <input
              style={{ fontSize: "16px" }}
              className="w-full p-3 rounded-full pl-10 focus:outline-none"
              placeholder="Search..."
              onChange={(e) => onSearch(e.target.value)} // Call onSearch when the input changes
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
