import React, { useState, useEffect } from "react";
import arrow from "../../assets/arrow-right-up-line.svg";
import PopUnanswered from "./pop_unanswered";
import Modal from "react-responsive-modal";
import refresh from "../../assets/refreshGray.svg";
import "react-responsive-modal/styles.css";

interface UnansweredQuestionsProps {
  onRobotClick: () => void;
}

interface CategoryData {
  category: string;
  unanswered_count: number;
}

const UnansweredQuestions: React.FC<UnansweredQuestionsProps> = ({
  onRobotClick,
}) => {
  const [unansweredCount, setUnansweredCount] = useState(0);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    const fetchUnansweredQuestionsCount = async () => {
      try {
        const response = await fetch(
          "https://rapid-govern-be-bg36gz65wa-uc.a.run.app/unanswered_questions_count",
          {
            method: "GET",
            headers: new Headers({
              Accept: "application/json",
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setUnansweredCount(data.unanswered_questions_count);
      } catch (err) {
        console.error("Error fetching unanswered questions count:", err);
      }
    };

    const fetchUnansweredQuestionsByCategory = async () => {
      try {
        const response = await fetch(
          "https://rapid-govern-be-bg36gz65wa-uc.a.run.app/unanswered_questions_by_category",
          {
            method: "GET",
            headers: new Headers({
              Accept: "application/json",
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setCategories(data.unanswered_questions_by_category);
      } catch (err) {
        console.error("Error fetching unanswered questions by category:", err);
      }
    };

    fetchUnansweredQuestionsCount();
    fetchUnansweredQuestionsByCategory();
  }, []);

  const totalUnanswered = categories.reduce(
    (acc, category) => acc + category.unanswered_count,
    0
  );

  const getPercentage = (count: number) => {
    return totalUnanswered > 0
      ? ((count / totalUnanswered) * 100).toFixed(1)
      : "0.0";
  };

  const colorPalette = ["#C10104", "#E9616D", "#000D0F", "#7F7F7F"];

  const handleViewMoreClick = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <div className="w-full flex flex-col justify-center border-[7F8A8C] border rounded-xl">
      <div className="p-4 border-b border-[#ccc] flex items-center justify-between">
        <h1 className="text-[1.3vw] font-bold">
          Unanswered Questions
        </h1>
        <button className="flex items-center p-2 border rounded-lg">
          <img src={refresh} alt="refresh" width={16} height={16} />
        </button>
      </div>
      <div className="p-4">
        <span className="text-[#7F8A8C] text-lg font-bold">Distribution</span>
        <h2>
          <span className="text-black font-bold text-3xl">
            {totalUnanswered}{" "}
          </span>
          <span className="text-[#7F8A8C] font-semibold text-2xl">
            ({getPercentage(totalUnanswered)}%)
          </span>
        </h2>
        <div className="w-full flex box-border space-x-2 mt-6 h-20">
          {categories.map((category, index) => (
            <div
              key={index}
              style={{
                ...colorBarStyle,
                backgroundColor: colorPalette[index % colorPalette.length],
                width: `${getPercentage(category.unanswered_count)}%`,
                height: "100%",
              }}
            ></div>
          ))}
        </div>
      </div>
      <hr className="mb-4" />
      <div className="px-4 flex flex-col space-y-6 mb-4">
        {categories.map((category, index) => (
          <div key={index} style={questionTypeStyle}>
            <span
              style={{
                ...dotStyle,
                backgroundColor: colorPalette[index % colorPalette.length],
              }}
            ></span>
            <span>{category.category}</span>
            <span style={questionCountStyle}>
             <span className='text-black text-xl font-bold'> {category.unanswered_count} </span> (
              {getPercentage(category.unanswered_count)}%)
            </span>
          </div>
        ))}
      </div>
      <div className="mb-2" />
      <div
        className="border-t border-[#ccc] flex h-12 items-center justify-between px-4 rounded-b-lg"
        onClick={handleViewMoreClick}
      >
        <span className="ml-1 text-[#7F8A8C] text-lg font-bold">View More</span>
        <img src={arrow} alt="arrow" />
      </div>
      <Modal
        open={isPopupOpen}
        onClose={handleClosePopup}
        center
        styles={{
          modal: { maxHeight: "80vh", overflow: "auto" },
        }}
      >
        <PopUnanswered />
      </Modal>
    </div>
  );
};

const containerStyle: React.CSSProperties = {
  border: "1px solid #e0e0e0",
  borderRadius: "8px",
  padding: "16px",
  maxWidth: "300px",
  margin: "0 auto",
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "16px",
};

const titleStyle: React.CSSProperties = {
  fontSize: "18px",
  fontWeight: "bold",
};

const distributionStyle: React.CSSProperties = {
  marginBottom: "16px",
};

const distributionTextStyle: React.CSSProperties = {
  color: "#7F7F7F",
};

const distributionNumberStyle: React.CSSProperties = {
  fontSize: "24px",
  fontWeight: "bold",
};

const percentageStyle: React.CSSProperties = {
  fontSize: "18px",
  color: "#7F7F7F",
};

const colorBarsContainerStyle: React.CSSProperties = {
  display: "flex",
  gap: "4px",
  marginTop: "8px",
  overflowX: "auto",
};

const colorBarStyle: React.CSSProperties = {
  borderRadius: "4px",
  height: "130px",
};

const questionTypesContainerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
};

const questionTypeStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
};

const dotStyle: React.CSSProperties = {
  width: "8px",
  height: "8px",
  borderRadius: "50%",
};

const questionCountStyle: React.CSSProperties = {
  marginLeft: "auto",
  color: "#7F7F7F",
};

export default UnansweredQuestions;
