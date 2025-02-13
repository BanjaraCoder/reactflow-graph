import React, { useState } from "react";
import Select from "react-select";
import Edit from "../../assets/edit.svg";
import arrow from "../../assets/arrow-right-up-line.svg";
import Bar from "../../assets/bar.svg";
import Star from "../../assets/star.svg";
import Modal from "react-responsive-modal";
import dots from "../../assets/dots_in.svg";

interface PromptProps {
  name: string;
  number: string;
  isHighlighted: boolean;
  onViewMoreClick?: () => void;
}

const Questions: React.FC<PromptProps> = ({
  name,
  number,
  isHighlighted,
  onViewMoreClick,
}) => {
  const [selectedOption, setSelectedOption] = useState({
    value: "Today",
    label: "Today",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [popupContent, setPopupContent] = useState<React.ReactNode>(null);
  const [unansweredCount, setUnansweredCount] = useState(number);

  const options = [
    { value: "Today", label: "Today" },
    { value: "This Week", label: "This Week" },
    { value: "This Month", label: "This Month" },
  ];

  const vector =
    name === "Unanswered Questions"
      ? Bar
      : name === "New Questions"
      ? Edit
      : Star;

  const handleDateChange = async (option) => {
    setSelectedOption(option);
    if (name === "Unanswered Questions" && option) {
      await fetchUnansweredCount(option.value);
    }
  };

  const fetchUnansweredCount = async (dateFilter) => {
    const url =
      "https://rapid-govern-be-bg36gz65wa-uc.a.run.app/count_unanswered_prompts_by_date";
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ date_filter: dateFilter }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      setUnansweredCount(data.count_unanswered_prompts_by_date);
    } catch (error) {
      console.error("Error:", error);
      setUnansweredCount("Error");
    }
  };

  const fetchData = async () => {
    if (!selectedOption) return;

    let url = "";
    const dateFilter = selectedOption.value;

    if (name === "Unanswered Questions") {
      url =
        "https://rapid-govern-be-bg36gz65wa-uc.a.run.app/categorised_unanswered_questions_by_date";
    } else if (name === "New Questions") {
      url =
        "https://rapid-govern-be-bg36gz65wa-uc.a.run.app/latest_prompts_by_date";
    } else if (name === "Top Questions") {
      url =
        "https://rapid-govern-be-bg36gz65wa-uc.a.run.app/frequent_questions_by_date";
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ date_filter: dateFilter }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      console.log("API Response:", data); // Log the response data

      let content = null;
      if (
        name === "Unanswered Questions" &&
        data.categorised_unanswered_questions_by_date
      ) {
        content = (
          <div className="overflow-auto w-full h-full rounded-xl">
            <table className="min-w-full divide-y divide-gray-200 rounded">
              <thead className="bg-[#ebefef] text-[#7F8A8C] rounded">
                <tr>
                  <th className="h-12 text-center text-lg border-r border-gray-300 tracking-wider">
                    Prompt ID
                  </th>
                  <th className="h-12 text-center text-lg border-r border-gray-300 tracking-wider">
                    Category
                  </th>
                  <th className="h-12 text-center text-lg border-r border-gray-300 tracking-wider">
                    Question
                  </th>
                  <th className="h-12 text-center text-lg border-r border-gray-300 tracking-wider">
                    Response Timestamp
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.categorised_unanswered_questions_by_date.map(
                  (item, index) => (
                    <tr
                      key={index}
                      className="h-12 whitespace-nowrap p-4 text-sm text-gray-900 border-r border-gray-300 hover:bg-gray-100 odd:bg-[#B4C0C2]/5 even:bg-[#B4C0C2]/6"
                    >
                      <td className="h-12 whitespace-nowrap p-4 text-sm text-gray-900 border-r border-gray-300">
                        {item.prompt_id}
                      </td>
                      <td className="h-12 whitespace-nowrap p-4 text-sm text-gray-900 border-r border-gray-300">
                        {item.category}
                      </td>
                      <td className="h-12 whitespace-nowrap p-4 text-sm text-gray-900 border-r border-gray-300">
                        {item.question}
                      </td>
                      <td className="h-12 whitespace-nowrap p-4 text-sm text-gray-900 border-r border-gray-300">
                        {item.response_timestamp}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        );
      } else if (name === "New Questions" && data.latest_prompts_by_date) {
        content = (
          <div className="overflow-auto w-full h-full rounded-xl">
            <table className="min-w-full divide-y divide-gray-200 rounded">
              <thead className="bg-[#ebefef] text-[#7F8A8C] rounded">
                <tr>
                  <th className="h-12 text-center text-lg border-r border-gray-300 tracking-wider">
                    Date
                  </th>
                  <th className="h-12 text-center text-lg border-r border-gray-300 tracking-wider">
                    Question
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.latest_prompts_by_date.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b hover:bg-gray-100 odd:bg-[#B4C0C2]/5 text-black even:bg-[#B4C0C2]/6"
                  >
                    <td className="h-12 whitespace-nowrap p-4 text-sm text-gray-900 border-r border-gray-300">
                      {item.date}
                    </td>
                    <td className="h-12 whitespace-nowrap p-4 text-sm text-gray-900 border-r border-gray-300">
                      {item.question}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      } else if (name === "Top Questions" && data.frequent_questions_by_date) {
        content = (
          <div className="overflow-auto w-full h-full rounded-xl">
            <table className="min-w-full divide-y divide-gray-200 rounded">
              <thead className="bg-[#ebefef] text-[#7F8A8C] rounded">
                <tr>
                  <th className="h-12 text-center text-lg border-r border-gray-300 tracking-wider">
                    Question
                  </th>
                  <th className="h-12 text-center text-lg border-r border-gray-300 tracking-wider">
                    Frequency
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.frequent_questions_by_date.map((item, index) => (
                  <tr
                    key={index}
                    className="h-12 whitespace-nowrap p-4 text-sm text-gray-900 border-r border-gray-300"
                  >
                    <td className="h-12 whitespace-nowrap p-4 text-sm text-gray-900 border-r border-gray-300">
                      {item.question}
                    </td>
                    <td className="h-12 whitespace-nowrap p-4 text-sm text-gray-900 border-r border-gray-300">
                      {item.frequency}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }

      setPopupContent(content);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error:", error);
      setPopupContent(<p>Error loading data</p>);
      setIsModalOpen(true);
    }
  };
  const customStyles = {
    container: (provided) => ({
      ...provided,
      borderRadius: "10px", // Adjust border radius as needed
    }),
    control: (provided, state) => ({
      ...provided,
      borderRadius: "10px", // Adjust border radius as needed
      backgroundColor: "hsl(0, 100%, 98%)", // Background color of the select control
      borderColor: state.isFocused ? "#FF6666" : "#FF6666", // Border color when focused and not focused
      boxShadow: state.isFocused ? "0 0 0 1px red" : "none", // Box shadow for focus state
      "&:hover": {
        borderColor: "#FF6666", // Border color on hover
      },
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: "10px", // Adjust border radius as needed
      borderColor: "#FF6666", // Border color of the dropdown menu
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#FF6666", // Text color for the selected value
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: "#FF6666", // Color of the dropdown arrow
    }),
    indicatorSeparator: (provided) => ({
      ...provided,
      backgroundColor: "#FF6666", // Separator color
    }),
  };
  return (
    <div className="border border-[#ccc] w-full rounded-lg box-border space-y-3">
      <div className="p-3 flex space-y-5 flex-col">
        <div className="w-full  px-2 flex justify-between items-center">
          <p className="font-bold text-xl sm:text-lg">{name}</p>
          <img src={dots} alt="" />
        </div>
        <div className="flex  items-center justify-between">
          <div className="flex space-x-2 items-center">
            <div className="bg-black h-10 w-10 flex justify-center items-center rounded-full">
              <img src={vector} className="bg-black rounded-full" alt="Edit" />
            </div>
            <p className="flex space-x-1 items-baseline">
              <span className="text-2xl font-bold">{unansweredCount}</span>
              <span className="">Questions</span>
            </p>
          </div>
          <Select
            value={selectedOption}
            onChange={handleDateChange}
            options={options}
            styles={customStyles}
          />
        </div>
      </div>
      <button
        className="flex h-12 border-t border-[#ccc] w-full justify-between items-center px-4"
        onClick={fetchData}
      >
        <span className="text-[#7F8A8C] font-bold">View More</span>
        <img src={arrow} alt="arrow" />
      </button>

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} center>
        {popupContent}
      </Modal>
    </div>
  );
};

export default Questions;
