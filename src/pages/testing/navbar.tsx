import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaRegBookmark } from 'react-icons/fa';
import { MdKeyboardArrowDown } from "react-icons/md";
import { MdOutlineRemoveRedEye } from "react-icons/md";

interface NavbarProps {
  onZoomChange: (zoomLevel: number) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onZoomChange }) => {
  const location = useLocation();
  const [zoomOptionsVisible, setZoomOptionsVisible] = useState(false);
  const [currentZoom, setCurrentZoom] = useState(100); // Default zoom level as 100%

  const handleZoomChange = (zoomLevel: number) => {
    setCurrentZoom(zoomLevel * 100); // Update the state with the zoom level in percentage
    onZoomChange(zoomLevel);
    setZoomOptionsVisible(false);
  };

  return (
    <div className='flex justify-between'>
      <nav className="mb-3 rounded py-2 px-1 h-10 bg-gray-200 w-[300px]">
        <ul className="flex items-center space-x-4">
          <li>
            <Link
              to="/graph/explore"
              className={`px-4 py-2 rounded ${location.pathname === '/graph/explore' ? 'bg-white text-black' : 'bg-transparent text-gray-500'}`}
            >
              Explore
            </Link>
          </li>
          <li>
            <Link
              to="/graph/query"
              className={`px-4 py-2 rounded ${location.pathname === '/graph/query' ? 'bg-white text-black' : 'bg-transparent text-gray-500'}`}
            >
              Query
            </Link>
          </li>
          <li className='text-gray-500 cursor-pointer hover:text-black'>
            Import
          </li>
        </ul>
      </nav>

      <div className="flex h-8 space-x-4">
        <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-1 rounded">
          Send Feedback
        </button>

        <button className="p-2 bg-color-1 text-gray-500 rounded hover:bg-gray-200">
          <MdOutlineRemoveRedEye size={20} />
        </button>
        <button className="p-2 rounded bg-color-1 text-gray-500 hover:bg-gray-200">
          <FaRegBookmark size={20} />
        </button>
        
        <div className="relative">
          <button 
            className="p-2 flex items-center text-gray-500 rounded hover:bg-gray-200"
            onClick={() => setZoomOptionsVisible(!zoomOptionsVisible)}
          >
            {currentZoom}% {/* Display the current zoom level */}
            <MdKeyboardArrowDown size={20} />
          </button>
          
          {zoomOptionsVisible && (
            <div className="absolute right-0 mt-2 w-24 bg-white border border-gray-300 rounded shadow-lg z-10">
              <ul className="text-gray-700">
                <li className="p-2 hover:bg-gray-200 cursor-pointer" onClick={() => handleZoomChange(1)}>100%</li>
                <li className="p-2 hover:bg-gray-200 cursor-pointer" onClick={() => handleZoomChange(0.75)}>75%</li>
                <li className="p-2 hover:bg-gray-200 cursor-pointer" onClick={() => handleZoomChange(0.5)}>50%</li>
                <li className="p-2 hover:bg-gray-200 cursor-pointer" onClick={() => handleZoomChange(0.25)}>25%</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
