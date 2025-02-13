import React, { useState, useEffect } from "react";
import { Radar } from "react-chartjs-2";
import rightArrow from "../../assets/rightarrow.svg";
import downArrow from "../../assets/downArrowGray.svg";
import refresh from "../../assets/refreshGray.svg";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  CategoryScale,
  BarElement,
} from "chart.js";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  CategoryScale,
  BarElement
);

const API_ROUTE = "https://rapid-govern-be-bg36gz65wa-uc.a.run.app/sentiment_distribution";
const COLORS = ["#c10104ff", "#ffa6d2ff", "#ff6666ff", "#3a2f2fff", "#ca3679ff", "#7F7F7F"]

const options = {
  responsive: true,
  scales: {
    r: {
      angleLines: {
        display: true,
        color: "rgba(0, 0, 0, 0.1)",
        lineWidth: 1,
      },
      grid: {
        circular: true,
        color: "#ccc",
        lineWidth: 1,
      },
      pointLabels: {
        font: {
          size: 14,
        },
        color: "black",
      },
      ticks: {
        // stepSize: 10,
        display: false,
      },
    },
  },
  plugins: {
    legend: {
      display: true,
      position: "left",
      labels:{
        color: "black"
      }
    },
  },
  maintainAspectRatio: true,
};


const SentimentRadarChart: React.FC = () => {
  const [radarData, setRadarData] = useState({
    labels: ["Positive", "Neutral", "Negative"],
    datasets: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          API_ROUTE,
          {
            method: "GET",
            headers: new Headers({
              "ngrok-skip-browser-warning": "69420",
              Accept: "application/json",
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("API response:", data); // Log full response

        if (data && data.sentiment_distribution) {
          const datasets = data.sentiment_distribution.map(
            (monthData, index) => {
              const { month, positive, neutral, negative } = monthData;
              return {
                label: month,
                data: [
                  Math.round(positive),
                  Math.round(neutral),
                  Math.round(negative),
                ],
                backgroundColor: COLORS[index % COLORS.length],
                borderColor:
                  COLORS[index % COLORS.length],
                borderWidth: 1  ,
                pointBackgroundColor:
                  COLORS[index % COLORS.length],

                  pointBorderWidth: 2, // Width of the point border
                  pointRadius: 5, // Size of the points
              };
            }
          );

          setRadarData({
            labels: ["Positive", "Neutral", "Negative"],
            datasets,
          });
        } else {
          console.error("Unexpected API response structure:", data);
        }
      } catch (e) {
        console.error("/sentiment_distribution:", e);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-full h-full rounded-lg justify-center">
      <div className=" h-20 rounded-t-lg flex items-center box-border px-4 justify-between">
        <h1 className="text-[1vw] font-bold">Sentiment Distribution</h1>
        <div className="flex items-center space-x-3 text-sm">
          <button className="border border-[#7F8A8C] flex items-center gap-2 px-2 h-10 rounded-lg">
            August <img src={rightArrow} className="h-4 w-4" alt="" /> Present{" "}
            <img src={downArrow} className="w-3 h-3" alt="" />
          </button>
          <button className="rounded-xl border-[#7F8A8C] border h-10 w-12 flex items-center justify-center">
            <img className="h-5 w-5" src={refresh} alt="" />
          </button>
        </div>
      </div>
      <div className="h-[32rem] border-t w-full flex justify-center px-4">
        <div className="w-full h-full flex items-center justify-center">
        <Radar data={radarData} options={options} />
        </div>
      </div>
    </div>
  );
};

export default SentimentRadarChart;
