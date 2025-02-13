import { FaSearch, FaFilter, FaChevronDown, FaRobot, FaUserCircle } from 'react-icons/fa';

const MenuBar = () => {
  return (
    <div className="bg-white h-16 flex items-center justify-between px-16 py-2 border-b border-gray-200 shadow-sm fixed top-0 left-0 right-0 z-10">
      {/* Confidentiality Concierge and Rapid Secure */}
      <div className="flex items-center space-x-4">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">
            <span className="block text-xs text-gray-400">Confidentiality Concierge</span>
            <span className="text-gray-800">Rapid Secure</span>
          </h1>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative ml-8 mt-1 flex items-center">
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="Search"
            className="bg-gray-100 rounded-md pl-10 pr-12 py-2 focus:outline-none w-72"
            style={{ paddingLeft: '2.0rem' }} 
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" />
          <FaFilter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 cursor-pointer" />
        </div>
      </div>

      {/* Space between search boxes */}
      <div className="mx-4"></div> 

      {/* AI Search Bar */}
      <div className="relative flex items-center border-black border rounded-md bg-white">
        <input
          type="text"
          placeholder="Search with AI"
          className="bg-white rounded-md pl-10 pr-8 py-2 focus:outline-none w-48"
          style={{ paddingLeft: '2.0rem' }} 
        />
        <FaRobot className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-600" />
      </div>

      {/* User profile */}
      <div className="flex items-center ml-auto border-black border rounded-md px-3 py-0.5 space-x-2" style={{ minWidth: '140px' }}>
        <div className="bg-white rounded-md flex items-center justify-center">
          <FaUserCircle className="text-gray-600 h-6 w-6" />
          <div className="ml-1">
            <span className="text-gray-800 block">Matt Andrew</span>
            <span className="text-xs text-gray-500" style={{ fontSize: '0.75rem' }}>matta@arhasi.com</span>
          </div>
          <FaChevronDown className="text-gray-600 ml-3" />
        </div>
      </div>

    </div>
  );
};

export default MenuBar;
