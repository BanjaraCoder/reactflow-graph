import LeftArrow from "../../assets/leftArrow.svg";
import whitePlus from "../../assets/whitePlus.svg";
import LinkGray from "../../assets/linkGray.svg";
import dotsGray from "../../assets/dots_in.svg";
import Calendar from "../../assets/calendar.svg";
import downArrow from "../../assets/downArrowGray.svg";
import refresh from "../../assets/refreshGray.svg";
import { Link } from 'react-router-dom';

const UselessButtons = () => {
  return (
    <div className="w-full flex flex-col space-y-3">
      <Link to="/chatbot_analytics" className="border border-[#7F8A8C] flex items-center gap-2 px-3 py-2 rounded-lg w-fit mb-4">
        <img src={LeftArrow} alt="" className="h-3 w-3" />
        Go Back
      </Link>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Agent Analytics Dashboard</h1>
        <div className="flex space-x-3">
          <button className=" bg-black text-white rounded-xl flex items-center px-3 h-12  gap-2 font-bold">
            <img src={whitePlus} className="w-4 h-4" alt="" />
            Custom Metrics
          </button>
          <button className=" font-semibold text-white rounded-xl px-3 h-12 text-lg bg-[#C10104]">
            Save
          </button>
          <button className="rounded-xl border-[#7F8A8C] border h-12 w-12 flex items-center justify-center">
            <img className="h-5 w-5" src={LinkGray} alt="" />
          </button>
          <button className="rounded-xl border-[#7F8A8C] border h-12 w-12 flex items-center justify-center">
            <img className="h-5 w-5" src={dotsGray} alt="" />
          </button>
        </div>
      </div>
      <div className="flex items-center w-ful">
        <div className="w-full flex space-x-4">
          <button className="flex text-[#7F8A8C] text-lg items-center gap-2">
            <img src={Calendar} alt="" className="h-5 w-5" />
            Date Range
          </button>
          <button className="flex items-center border border-[#7F8A8C] px-4 py-2 rounded-lg gap-2 font-semibold text-[#7F8A8C]">
            Custom
            <img className="w-3 h-3" src={downArrow} alt="" />
          </button>
          <button className="text-[#C10104] border-2 border-[#C10104] rounded-lg px-4 py-2 bg-[#fff0f0] flex items-center justify-center">
            Overview
          </button>
          <div className="flex items-center gap-3 px-3 py-2 border border-[#7F8A8C] rounded-lg">
            <span className="text-[#7F8A8C]">7D</span>
            <span className="text-[#7F8A8C]">30D</span>
            <span className="text-[#7F8A8C]">90D</span>
            <span className="text-[#7F8A8C]">6M</span>
            <span className="text-[#7F8A8C]">12M</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <p className="text-lg font-normal whitespace-nowrap text-[#7F8A8C]">
            Last Updated
          </p>
          <p className="text-lg font-bold whitespace-nowrap text-[#7F8A8C]">
            * 46 Minutes Ago
          </p>
          <span className="text-xl whitespace-nowrap text-[#7F8A8C]">|</span>
          <p className="text-lg font-bold whitespace-nowrap text-[#7F8A8C]">
            Refresh
          </p>
          <button className="rounded-xl border-[#7F8A8C] border h-12 w-12 flex items-center justify-center">
            <img className="h-5 w-5" src={refresh} alt="" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UselessButtons;
