/* eslint-disable @typescript-eslint/no-explicit-any */
import { logo, rightArrow } from '../assets';
import { useNavigate } from 'react-router-dom';

import { navbarFirstSection, navbarSecondSection } from '../assets/constants';

const VerticalNavbar = ({
  isExpanded,
  toggleNavbar,
}: {
  isExpanded: boolean;
  toggleNavbar: any;
}) => {
  const navigate = useNavigate();
  return (
    <div
      className={`fixed left-0 top-0 h-screen flex flex-col bg-[#000D0F] text-white ${
        isExpanded ? 'w-[10%]' : 'w-[inherit]'
      } transition-width duration-300`}
    >
      <div className='flex items-center justify-center h-16 my-5'>
        <div className='rounded-full '>
          <img src={logo} alt='' width={34} height={34} />
        </div>
      </div>

      <div className='flex-grow flex flex-col space-y-4 mt-4'>
        <div
          className={`relative hover:bg-[#FFFFFF]/10 w-full flex items-center h-[2.875rem] hover:border-r-4 hover:border-r-red-600 cursor-pointer ${
            isExpanded ? 'pl-[28%]' : 'justify-center'
          }`}
        >
          <button className='w-8 h-8 flex items-center justify-center rounded-md'>
            <span className='text-gray-400 font-light text-xs uppercase'>
              Menu
            </span>
          </button>
        </div>
        <div className='flex flex-col w-full'>
          {navbarFirstSection.map((item) => (
            
            <button
              className={`flex items-center  hover:bg-[#FFFFFF]/10 w-full h-[2.875rem] hover:border-r-4 hover:border-r-red-600 cursor-pointer mb-3 ${
                isExpanded ? 'pl-[25%]' : 'pl-[40%]'
              }`}
              onClick={() => navigate(item.path)}
            >
              <div className='flex items-center text-xs gap-2'>

                <img src={item.icon} alt='' width={18} height={18} />
                {isExpanded && <p>{item.name}</p>}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className='flex flex-col items-center'>
        <div
          className={`flex items-center  hover:bg-[#FFFFFF]/10 w-full h-[2.875rem] hover:border-r-4 hover:border-r-red-600 cursor-pointer mb-3 ${
            isExpanded ? 'pl-[27%]' : 'justify-center'
          }`}
        >
          <button className='text-gray-400 font-light text-xs uppercase'>
            More
          </button>
        </div>
        <div className='flex flex-col justify-center w-full'>
          {navbarSecondSection.map((item) => (
            <button
              className={`flex items-center  hover:bg-[#FFFFFF]/10 w-full h-[2.875rem] hover:border-r-4 hover:border-r-red-600 cursor-pointer mb-3 ${
                isExpanded ? 'pl-[25%]' : 'pl-[40%]'
              }`}
            >
              <div className='flex items-center text-xs gap-2'>
                <img src={item.icon} alt='' width={18} height={18} />
                {isExpanded && <p>{item.name}</p>}
              </div>
            </button>
          ))}
        </div>
        <div
          className='flex items-center justify-center hover:bg-[#FFFFFF]/10 w-full h-[2.875rem] hover:border-r-4 hover:border-r-red-600 cursor-pointer mb-3'
          onClick={toggleNavbar}
        >
          <button className='text-gray-400 font-light text-xs uppercase'>
            {isExpanded ? (
              <img src={rightArrow} alt='' className='transform rotate-180' />
            ) : (
              <img src={rightArrow} alt='' onClick={toggleNavbar} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerticalNavbar;