import React from "react";
import Dots from "../../../assets/Dots.svg";
import Edit from "../../../assets/edit.svg";
import arrow from "../../../assets/arrow-right-up-line.svg";

interface PromptProps {
  name: string;
  number: string;
  isHighlighted: boolean;
}

const Questions: React.FC<PromptProps> = ({ name, number, isHighlighted }) => {
  return (
    <div className="w-full  bg-[#FFF] border-[#e2e4e5] border-2 rounded-lg mb-4">
      <div className="flex w-full justify-between items-center pt-2 px-2 pb-1">
        <div className="font-bold">{name}</div>
        <div>
          <img src={Dots} alt="three dots" />
        </div>
      </div>
      <div className="px-2 pb-2">
        <div className="bg-[#FFF] flex flex-row px-2 py-2 items-center justify-between rounded-lg">
          <div className="flex flex-row items-center">
            <div className="border-2 border-[#596263] rounded bg-[#121e20] p-1">
              <img src={Edit} alt="Edit" />
            </div>
            <div className="text-black ml-1">
              {number}
              <span className="ml-1 text-black text-sm">Questions</span>
            </div>
          </div>
          <div className="text-[#FF0000] text-sm border-2 border-[#FF0000] rounded-full bg-[#f0f0f0] p-1 px-2">
            This Month
          </div>
        </div>
      </div>

      <div className="flex w-full justify-between items-center bg-[#f0f0f0] pt-3 px-2 pb-1">
              <span className="ml-1 text-black text-sm">View More</span>
              <img src={arrow} alt="arrow" />
      </div>
    </div>
  );
};

export default Questions;
