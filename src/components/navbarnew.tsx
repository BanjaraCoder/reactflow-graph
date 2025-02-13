import search from '../assets/search.svg';
// import profile from '../assets/profile.svg';
import logo from '../assets/logo.svg';
import filter from '../assets/filter.svg';
import robot from '../assets/robot.svg';
// import logo_assess from '../assets/logo_assess.svg';
// import downArrow from '../assets/downArrow.svg';
import ProfileCard from './ProfileCard';
import { useLocation } from 'react-router-dom';
// import logo_govern from '../assets/logo_govern.svg';
// import logo_assure from '../assets/logo_assure.svg';
import logo_chatbot_analytics from '../assets/Title.svg';

// Confidentiality Concierge

const TopNavbar = ({ isExpanded }: { isExpanded: boolean }) => {
  const location = useLocation();

  const getLogo = (pathname: string) => {

    if (pathname.startsWith('/chatbot_analytics')) {
          return logo_chatbot_analytics;
        }
    if (pathname.startsWith('/chatbot_analytics2')) {
              return logo_chatbot_analytics;
            }
        if (pathname.startsWith("/graph/explore")) {
              return logo_chatbot_analytics;
            }
        if (pathname.startsWith("/graph/query")) {
                  return logo_chatbot_analytics;
                }
    switch (pathname) {
      default:
        return logo;
    }
  };
  const FinalLogo = getLogo(location.pathname);
  return (
    <header
      className={`fixed top-0 right-0 h-[6rem] ${
        isExpanded ? 'left-[10%]' : 'left-[6%]'
      } z-40 bg-white flex items-center justify-between border border-[#E5E5E5] transition-width duration-300`}
    >
      <div className='flex items-center'>
        <div className='flex p-[2.25rem]'>
          <div className='flex flex-col justify-center items-center'>

            <img src={FinalLogo} alt='' width={219} height={27} />
          </div>
        </div>

        <div className='flex gap-6'>
          <div className='relative'>
            <input
              type='text'
              placeholder='Search'
              className='pl-10 pr-[18rem] py-2 border rounded-[12px] focus:outline-none w-[31.25rem] h-[3.375rem] bg-[#B4C0C2]/10 border-[#7F8A8C]/20'
            />
            <div className='absolute left-3 top-1/2 transform -translate-y-1/2'>
              <img src={search} alt='' width={20} height={20} />
            </div>
            <button className='absolute right-3 top-1/2 transform -translate-y-1/2 border rounded-[4px] p-1 bg-white border-[#7F8A8C]/20'>
              <img src={filter} alt='' width={20} height={20} />
            </button>
          </div>
          <button className='flex items-center justify-center space-x-2 border-2 w-[9.375rem] h-[3.375rem] px-[0.875rem] py-[1.094rem] rounded-[12px]'>
            <img src={robot} alt='' width={20} height={20} />
            <span className='text-[0.8rem] text-[#7F8A8C]'>Search with AI</span>
          </button>
        </div>
      </div>
      <ProfileCard />
    </header>
  );
};

export default TopNavbar;