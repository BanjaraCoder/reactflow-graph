import { useState } from "react";
import profile from "../assets/ai_arhasi_logo.jpeg";

const ProfileCard = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-3">
        <img
          src={profile}
          alt="Profile"
          className="w-10 h-10 rounded-full object-contain"
          width={20}
          height={20}
        />
        <div className="flex flex-col text-left">
          <span className="font-semibold text-base">
            Chiru Bhavansikar
          </span>
          <span className="text-sm text-gray-500">
            chiru@arhasi.com
          </span>
        </div>
      </div>
      <div className="relative mr-[36px]">
        <button
          className="flex items-center justify-center w-8 h-8 rounded-full focus:outline-none border"
          onClick={toggleDropdown}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </button>
        {dropdownOpen && (
          <div
            className="absolute top-[3.5rem] w-48 h-12 pl-4 flex items-center justify-start bg-white border border-gray-200 rounded-md shadow-lg -translate-x-[85%] cursor-pointer"
            role="button"
            onClick={() => setDropdownOpen(false)}
          >
            Settings
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;