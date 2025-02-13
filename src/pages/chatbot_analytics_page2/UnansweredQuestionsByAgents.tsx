import { useState, useEffect } from "react";
import { PolarArea } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";
import arrow from "../../assets/arrow-right-up-line.svg";
import Modal from "react-responsive-modal";
import rightArrow from "../../assets/rightarrow.svg";
import downArrow from "../../assets/downArrowGray.svg";
import refresh from "../../assets/refreshGray.svg";
import UnansweredQuestionsByAgentPopup from "./UnansweredQuestionsByAgentPopup";

ChartJS.register(
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend
);

const COLORS = ["#c10104ff", "#ffa6d2ff", "#ff6666ff", "#3a2f2fff", "#ca3679ff", "#7F7F7F"]

const API_ROUTE = "https://rapid-govern-be-bg36gz65wa-uc.a.run.app/unanswered_questions_by_agent";

const fetchUnansweredQuestionsByAgent = async () => {
  try {
    const unansweredQuestionsByAgent = await fetch(API_ROUTE, {
      method: "GET",
      headers: new Headers({
        "ngrok-skip-browser-warning": "69420",
        Accept: "application/json",
      }),
    });
    const unansweredQuestionsByAgentData = await unansweredQuestionsByAgent.json();
    console.log(unansweredQuestionsByAgentData.unanswered_questions_by_agent);
    return unansweredQuestionsByAgentData.unanswered_questions_by_agent;
  } catch (e) {
    console.error("API Error: /unanswered_questions_by_agent", e);
  }
};

const UnansweredQuestionsByAgent = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [unansweredData, setUnansweredData] = useState([]);

  useEffect(() => {
    const getunansweredQuestionsByAgent = async () => {
      const unansweredQuestionsByAgent = await fetchUnansweredQuestionsByAgent();
      setUnansweredData(unansweredQuestionsByAgent);
    };
    getunansweredQuestionsByAgent();
  }, []);

  const labels = unansweredData.map((agent) => agent.agent_name);
  const data = unansweredData.map((agent) => agent.unanswered_count);
  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Unanswered Questions",
        data: data,
        backgroundColor: COLORS,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        ticks: {
          color: "black",

        },
        beginAtZero: true,
        pointLabels: {
          display: false,
          centerPointLabels: true,
          font: {
            size: 12
          },
        }
      },
      
    },
    plugins: {
      legend: {
        position: "left",
        labels: {
          color: "black",
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.label || "";
            if (label) {
              label += ": " + context.raw;
            }
            return label;
          },
        },
      },
    },
  };

  return (
    <div className="w-full h-full rounded-lg justify-center">
      <div className="border-b h-20 rounded-t-lg flex items-center box-border px-4 justify-between">
        <h1 className="text-[1vw] font-bold">Unanswered Questions Per Agent</h1>
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
      <div className="h-[30rem] w-full flex justify-center items-center px-4">
        <div className="w-full h-[80%] flex items-center">
          <PolarArea data={chartData} options={options} />
        </div>
      </div>
      <Modal open={isPopupOpen} onClose={() => setIsPopupOpen(false)} center>
        <UnansweredQuestionsByAgentPopup
          unansweredQuestionsByAgent={unansweredData}
        />
      </Modal>
    </div>
  );
};

export default UnansweredQuestionsByAgent;
