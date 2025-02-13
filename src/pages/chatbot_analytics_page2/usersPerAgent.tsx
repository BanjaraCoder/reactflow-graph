import { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./popup.css"
import arrow from "../../assets/arrow-right-up-line.svg";
import Select from "react-select";
import UsersByAgent from "./usersByAgentPopup";
import Modal from "react-responsive-modal";
import ProgressBar from "@ramonak/react-progress-bar";
import rightArrow from "../../assets/rightarrow.svg";
import downArrow from "../../assets/downArrowGray.svg";
import refresh from "../../assets/refreshGray.svg";
import "./popup.css"

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);


const API_ROUTE = 
  "https://rapid-govern-be-bg36gz65wa-uc.a.run.app/users_by_agent";

const fetchUsersPerAgent = async () => {
  try {
    const fetchusersPerAgent = await fetch(API_ROUTE, {
      method: "GET",
      headers: new Headers({
        "ngrok-skip-browser-warning": "69420",
        Accept: "application/json",
      }),
    });
    const usersPerAgent = await fetchusersPerAgent.json();
    console.log("frequentDocuments", usersPerAgent.users_by_agent);
    return usersPerAgent.users_by_agent;
  } catch (e) {
    console.error("API Error: /users_by_agent", e);
  }
};

const UsersPerAgent = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [usersPerAgentData, setUsersPerAgentData] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState("All Agents");

  useEffect(() => {
    const getFrequentlyReferencedPages = async () => {
      const usersPerAgent = await fetchUsersPerAgent();
      setUsersPerAgentData(usersPerAgent);
    };
    getFrequentlyReferencedPages();
  }, []);

  const filteredData =
    selectedAgent === "All Agents"
      ? usersPerAgentData
      : usersPerAgentData.filter((agent) => agent.agent_id === selectedAgent);

  const labels = filteredData.map((agent) => agent.agent_name);
  const data = filteredData.map((agent) => agent.user_count);

  const maxCount = Math.max(...usersPerAgentData.map((agent) => agent.user_count));

  const selectAgents = usersPerAgentData.map((agent) => {
    const obj = {
      value: agent.agent_id,
      label: agent.agent_name,
    };
    return obj;
  });
  const defaultAgent = { value: "All Agents", label: "All Agents" };
  selectAgents.push(defaultAgent);

  console.log("Data", filteredData);
  const percentageOfXToY = (x: number, y: number): number => {
    return (x / y) * 100;
  };

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "No. of users",
        data: data,
        backgroundColor: "#c10104",
        borderRadius: 5,
        barThickness: 40,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        title: {
          display: true,
          text: "Agent",
          color: "black",
          padding: {
            top: 20,
          },
        },
        ticks: {
          color: "black",
          callback: function (value) {
            const label = this.getLabelForValue(value);
            if (label.length > 20) {
              return label.substring(0, 20) + "..."; // Truncate long labels
            }
            return label;
          },
        },
      },
      y: {
        title: {
          display: true,
          text: "No. of Users",
          color: "black",
          padding: {
            bottom: 20,
          },
        },
        ticks: {
          color: "black",
          callback: function (value) {
            return Number.isInteger(value) ? value : ""; // Display only whole numbers
          },
        },
        beginAtZero: true,
      },
    },
  };
  return (
    <div className="w-full h-full rounded-lg justify-center">
      <div className="border-b h-20 rounded-t-lg flex items-center box-border px-4 justify-between">
        <h1 className="text-[1vw] font-bold">Users per Agent</h1>
        <div className="flex items-center space-x-3 text-sm">
          <button className="border border-[#7F8A8C] flex items-center gap-2 px-2 h-10 rounded-lg">
            August <img src={rightArrow} className="h-4 w-4" alt="" /> Present{" "}
            <img src={downArrow} alt="" className="w-3 h-3"/>
          </button>
          <button
            className="flex items-center border rounded-lg px-2 h-10 cursor-pointer"
            onClick={() => setIsPopupOpen(true)}
          >
            <span>View More</span>
            <img
              src={arrow}
              alt="arrow"
              width={20}
              height={20}
              className="ml-2"
            />
          </button>
          <button className="rounded-xl border-[#7F8A8C] border h-10 w-12 flex items-center justify-center">
            <img className="h-5 w-5" src={refresh} alt="" />
          </button>
        </div>
      </div>
      <div className="w-full flex justify-end pr-5 pt-3">
        <Select
          options={selectAgents}
          defaultValue={defaultAgent}
          onChange={(selectedOption) => setSelectedAgent(selectedOption.value)}
        />
      </div>
      <div className="h-[25rem] mt-8 w-full px-4 flex flex-col space-y-8">
        {filteredData.map((agent) => {
          return (
            <div className=" flex flex-col space-y-4 justify-center">
              <span className="text-lg">{agent.agent_name}</span>
              <div className="w-full flex items-center justify-between pr-12">
              <ProgressBar
                completed={agent.user_count}
                maxCompleted={maxCount}
                isLabelVisible={false}
                height={50}
                bgColor="#ca3679ff"
                baseBgColor="#FFF4F4"
                borderRadius={10}
                animateOnRender={true}
                className="wrapper"
              />
              <span className="text-xl">{agent.user_count}</span>
              </div>
            </div>
          );
        })}
      </div>
      <Modal open={isPopupOpen} onClose={() => setIsPopupOpen(false)} center>
        <UsersByAgent usersByAgent={usersPerAgentData} />
      </Modal>
    </div>
  );
};

export default UsersPerAgent;
