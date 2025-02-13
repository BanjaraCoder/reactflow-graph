import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { downArrow } from "../../assets";
import refresh from "../../assets/refreshGray.svg";
import Select from "react-select";
import annotationPlugin from "chartjs-plugin-annotation";
import DateRangePicker from "rsuite/DateRangePicker";
import "rsuite/DateRangePicker/styles/index.css";
import "./datepicker.css"

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  annotationPlugin
);

const BarChart: React.FC = () => {
  const [totalQuestionsData, setTotalQuestionsData] = useState([]);
  const [categoryQuestionsData, setCategoryQuestionsData] = useState([]);
  const [showCategoryQuestions, setShowCategoryQuestions] = useState(false);
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  useEffect(() => {
    fetchTotalQuestionsData();
    fetchTopics();
  }, []);

  const fetchTotalQuestionsData = () => {
    fetch(
      "https://rapid-govern-be-bg36gz65wa-uc.a.run.app/get_total_questions_by_date"
    )
      .then((response) => response.json())
      .then((data) => {
        const formattedData = data.total_questions_by_date.map((item) => ({
          date: new Date(item.date),
          total_questions: item.total_questions,
        }));
        setTotalQuestionsData(formattedData);
      });
  };

  const fetchTopics = () => {
    fetch(
      "https://rapid-govern-be-bg36gz65wa-uc.a.run.app/getCurrentCategories"
    )
      .then((response) => response.json())
      .then((data) => {
        setTopics(data.categories);
      });
  };

  const handleFetchCategoryData = (data) => {
    const formattedData = data.category_questions_by_date.map((item) => ({
      date: new Date(item.date),
      category_questions: item.category_questions,
    }));
    setCategoryQuestionsData(formattedData);
    setShowCategoryQuestions(true);
  };

  const handleRefresh = () => {
    setShowCategoryQuestions(false);
    setCategoryQuestionsData([]);
    fetchTotalQuestionsData();
  };

  const filterDataByDateRange = (data, start, end) => {
    if (!start && !end) return data;
    if (!end)
      return data.filter(
        (item) => item.date.toDateString() === start.toDateString()
      );
    const endOfDay = new Date(end);
    endOfDay.setHours(23, 59, 59, 999); // Set end date to end of day
    return data.filter((item) => item.date >= start && item.date <= endOfDay);
  };

  const filteredTotalQuestionsData = filterDataByDateRange(
    totalQuestionsData,
    startDate,
    endDate
  );
  const filteredCategoryQuestionsData = filterDataByDateRange(
    categoryQuestionsData,
    startDate,
    endDate
  );

  const labels = filteredTotalQuestionsData.map((item) =>
    item.date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" })
  );

  const totalQuestionsDataset = filteredTotalQuestionsData.map(
    (item) => item.total_questions
  );
  const categoryQuestionsDataset = filteredCategoryQuestionsData.map(
    (item) => item.category_questions
  );

  const maxValue = Math.max(0, ...categoryQuestionsDataset);
  console.log(startDate);
  console.log(endDate);
  const data = {
    labels,
    datasets: [
      {
        label: "Total Questions",
        data: totalQuestionsDataset,
        backgroundColor: "#000D0F",
        borderColor: "#000D0F",
        borderRadius: 6,
        maxBarThickness: 35,
      },
      ...(showCategoryQuestions
        ? [
            {
              label: selectedTopic,
              data: categoryQuestionsDataset,
              backgroundColor: "#C10104",
              borderColor: "#C10104",
              borderRadius: 6,
              maxBarThickness: 35,
            },
          ]
        : []),
    ],
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return value;
          },
        },
      },
    },
    plugins: {
      annotation: {
        annotations: {
          line1: {
            type: "line",
            arrowHeads: {
              start: {
                display: true,
                length: 4,
                width: 4,
                backgroundColor: "#000",
                borderColor: "#00",
              },
            },
            yMin: maxValue,
            yMax: maxValue,
            borderColor: "hsl(0, 0%, 70%)",
            borderWidth: 2,
            label: {
              backgroundColor: "#C10104",
              xAdjust: 12,
              borderRadius: {
                topLeft: 20,
                bottomLeft: 20,
                topRight: 6,
                bottomRight: 6,
              },
              color: "white",
              padding: 10,
              display: showCategoryQuestions,
              content: `(${maxValue}%)`,
              position: "end",
            },
          },
        },
      },
      legend: {
        display: false, // Hide the legend
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.dataset.label || "";
            return label;
          },
        },
      },
    },
  };

  const dateRange =
    startDate && endDate
      ? `${startDate.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
        })} - ${endDate.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
        })}`
      : startDate
      ? `${startDate.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
        })}`
      : "Select Date Range";

  console.log(dateRange);

  const CustomInput = ({ value, onClick }) => (
    <button
      className="flex justify-between items-center border-2 rounded-lg px-2 py-1 text-xs h-10"
      onClick={onClick}
    >
      <h1>{value}</h1>
      <span>Pick date </span>
      <img
        src={downArrow}
        alt="downarrow"
        width={16}
        height={16}
        className="ml-2"
      />
    </button>
  );

  const handleTopicChange = (option) => {
    const topic = option.value;
    setSelectedTopic(topic);
    if (topic) {
      // Fetch data for the selected topic using POST request
      fetch(
        "https://rapid-govern-be-bg36gz65wa-uc.a.run.app/get_category_questions_by_date",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
          },
          body: JSON.stringify({ category: topic }),
        }
      )
        .then((response) => response.json())
        .then(handleFetchCategoryData);
    }
  };
  const selectOptions = topics.map((topic) => ({
    value: topic.category,
    label: topic.category,
  }));

  return (
    <div className="w-full h-full">
      <div className="py-8 bg-white rounded-lg ">
        <div className="flex px-6 justify-between items-center mb-2 w-full">
          <h1 className="text-[1vw] font-bold">
            Question Trends by Topic
          </h1>
          <div className="flex gap-2">
            <DateRangePicker
              format="dd MMM yy"
              character="->"
              placeholder="Select Date Range"
              size="md"
              onChange={(dates) => {
                const start = dates[0];
                const end = dates[1];
                setStartDate(start);
                setEndDate(end);
              }}
              className='custom-range-picker'
            />
            <Select
              value={selectOptions.find(
                (option) => option.value === selectedTopic
              )}
              onChange={(selectedOption) => handleTopicChange(selectedOption)}
              options={selectOptions}
              placeholder="Select Topic"
              styles={{
                container: (provided) => ({
                  ...provided,
                  width: "10rem", 
                }),
              }}
            />
            <button
              className="flex items-center p-2 border-2 rounded-lg"
              onClick={handleRefresh}
            >
              <img src={refresh} alt="refresh" width={16} height={16} />
            </button>
          </div>
        </div>
        <hr className="mb-2" />
        <div className="flex px-6 items-center mt-8 space-x-4">
          <span className="text-lg text-[#7F8A8C]">Frequency</span>
          {showCategoryQuestions && (
            <div className="flex items-center pr-2 gap-1">
              <span className="w-3 h-3 bg-red-700 rounded-full"></span>
              <span>{selectedTopic}</span>
            </div>
          )}
          <div className="flex items-center pr-2 gap-1">
            <span className="w-3 h-3 bg-black rounded-full"></span>
            <span>Total Questions</span>
          </div>
        </div>
      </div>
      <div className="w-[93%] mx-auto my-0 flex items-center justify-center">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default BarChart;
