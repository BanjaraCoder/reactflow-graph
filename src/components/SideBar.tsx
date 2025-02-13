// import React from 'react';
// import { FaBars, FaUser, FaCog, FaChevronRight } from 'react-icons/fa';
// import { GiSettingsKnobs } from 'react-icons/gi';

// const SideBar = () => {
//   return (
//     <div className="bg-gray-900 text-white h-screen w-16 flex flex-col items-center py-4">
//       <div className="mb-6">
//         <div className="bg-gray-800 rounded-full p-2">
//           <FaBars className="text-xl" />
//         </div>
//       </div>
//       <div className="flex-grow flex flex-col items-center space-y-6">
//         <div className="bg-gray-800 p-2 rounded-md">
//           <GiSettingsKnobs className="text-xl" />
//         </div>
//         <div className="bg-gray-800 p-2 rounded-md">
//           <FaUser className="text-xl" />
//         </div>
//         <div className="bg-gray-800 p-2 rounded-md">
//           <FaCog className="text-xl" />
//         </div>
//       </div>
//       <div className="mt-6">
//         <div className="bg-red-600 p-2 rounded-full">
//           <FaCog className="text-xl" />
//         </div>
//       </div>
//       <div className="mt-auto mb-4">
//         <div className="bg-gray-800 p-2 rounded-md">
//           <FaChevronRight className="text-xl" />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SideBar;


import { useState } from 'react';
import logo from './images/logo.svg';
import moreIcon from './images/more-icon.svg';
import gridIcon from './images/grid-icon.svg';
import boxIcon from './images/box-icon.svg';
import gearIcon from './images/gear-icon.svg';
import circleIcon from './images/circle-icon.svg';
import chevronRightIcon from './images/chevron-right-icon.svg';

function SideBar() {
  const [isOpen, setIsOpen] = useState(true);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className={`fixed top-0 left-0 h-screen w-60 bg-gray-900 text-white p-4 ${
        isOpen ? 'block' : 'hidden'
      }`}
    >
      <div className="flex justify-center mb-4">
        <img src={logo} alt="Logo" className="w-18 h-18" />
      </div>
      <div className="flex flex-col">
        <div className="flex items-center mb-4">
          {/* <img src={menuIcon} alt="Menu Icon" className="w-20 h-20 mr-2" /> */}
          <span className={isOpen ? 'block' : 'hidden'}>Menu</span>
        </div>
        <div className="flex items-center mb-4">
          <img src={gridIcon} alt="Grid Icon" className="w-18 h-18 mr-2" />
          <span className={isOpen ? 'block' : 'hidden'}>Grid</span>
        </div>
        <div className="flex items-center mb-4">
          <img src={boxIcon} alt="Box Icon" className="w-18 h-18 mr-2" />
          <span className={isOpen ? 'block' : 'hidden'}>Box</span>
        </div>
        <div className="flex items-center mb-4">
          <img src={gearIcon} alt="Gear Icon" className="w-18 h-18 mr-2" />
          <span className={isOpen ? 'block' : 'hidden'}>Gear</span>
        </div>
      </div>
      <div className="flex items-center mb-4">
        <img src={moreIcon} alt="More Icon" className="w-18 h-18 mr-2" />
        <span className={isOpen ? 'block' : 'hidden'}>More</span>
      </div>
      <div className="flex flex-col">
        <div className="flex items-center mb-4">
          <img src={circleIcon} alt="Circle Icon" className="w-18 h-18 mr-2" />
          <span className={isOpen ? 'block' : 'hidden'}>Circle</span>
        </div>
        <div className="flex items-center mb-4">
          <img src={gearIcon} alt="Gear Icon" className="w-18 h-18 mr-2" />
          <span className={isOpen ? 'block' : 'hidden'}>Gear</span>
        </div>
        <div className="flex items-center mb-4">
          <img src={chevronRightIcon} alt="Chevron Right Icon" className="w-18 h-18 mr-2" />
          <span className={isOpen ? 'block' : 'hidden'}>Chevron Right</span>
        </div>
      </div>
      <button
        className="flex items-center mb-4"
        onClick={handleToggle}
      >
        {isOpen ? 'Close' : 'Open'}
      </button>
    </div>
  );
}

export default SideBar;