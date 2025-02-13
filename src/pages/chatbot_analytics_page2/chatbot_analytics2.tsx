import { useState } from "react";
import SentimentRadarChart from "./RadarChart.tsx";
import UsersPerAgent from "./usersPerAgent.tsx";

import FrequentPages from "./frequentPages.tsx";
import UnansweredQuestionsByAgent from "./UnansweredQuestionsByAgents.tsx";
import UselessButtons from "./UselessButtons.tsx";

export default function Assess() {
  // const [options, setOptions] = useState(0);
  // const [dropdownOpen, setDropdownOpen] = useState(false);

  // const toggleDropdown = () => {
  //   setDropdownOpen(!dropdownOpen);
  // };


  return (
    <div className="w-full px-10 pb-10">
      <div className="box-border">
        <div className="w-full mb-20">
          <UselessButtons />
        </div>
        <div className="flex flex-col space-y-10">
          <div className="flex justify-between space-x-10">
            <div className="rounded-lg border border-[#ddd] bg-white mb-4 w-[49%]">
              <FrequentPages />
            </div>
            <div className="rounded-lg border border-[#ddd] bg-white mb-4 w-1/2">
              <SentimentRadarChart />
              {/* <RadarChart2 /> */}
            </div>
          </div>

          <div className="flex justify-between space-x-10">
            <div className="rounded-lg border border-[#ddd] bg-white mb-4 w-1/2">
              <UsersPerAgent />
              {/* <CustomBarChart /> */}
            </div>
            <div className="rounded-lg border border-[#ddd] bg-white mb-4 w-1/2">
              {/* <ChartWithAvatars /> */}
              <UnansweredQuestionsByAgent />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
