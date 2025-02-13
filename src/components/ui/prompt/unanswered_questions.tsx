import React from 'react';
import robot from '../../../assets/robot1.svg';
import arrow from "../../../assets/arrow-right-up-line.svg";
import restart from "../../../assets/restart-line.svg";

interface UnansweredQuestionsProps {
  onRobotClick: () => void;
}

const UnansweredQuestions: React.FC<UnansweredQuestionsProps> = ({ onRobotClick }) => {
  const colorBarData = [
    { color: '#C10104', percentage: 54.8 },
    { color: '#E9616D', percentage: 54.8 },
    { color: '#000D0F', percentage: 71.6 },
    { color: '#7F7F7F', percentage: 64.3 },
  ];

  return (
    <div className="w-full sm:w-[80%] md:w-[95%] lg:w-[115%]" style={containerStyle}>
      <div className="header" style={headerStyle}>
        <h1 style={titleStyle}>Unanswered Questions</h1>
        <button className="flex items-center border-2 bg-gray-50 rounded-lg px-2 py-2 ml-auto">
          <img
            src={restart}
            alt="refresh"
            width={20}
            height={20}
          />
        </button>
      </div>
      <hr className="mb-4" />
      <div className="distribution" style={distributionStyle}>
        <span style={distributionTextStyle}>Distribution</span>
        <h2 style={distributionNumberStyle}>
          16 <span style={percentageStyle}>(54.8%)</span>
        </h2>
        <div className="color-bars" style={colorBarsContainerStyle}>
          {colorBarData.map((bar, index) => (
            <div
              key={index}
              style={{
                ...colorBarStyle,
                backgroundColor: bar.color,
                width: `${bar.percentage}%`,
                height: '40px',
              }}
            ></div>
          ))}
        </div>
      </div>
      <hr className="mb-4" />
      <div className="question-types" style={questionTypesContainerStyle}>
        <div style={questionTypeStyle}>
          <span style={{ ...dotStyle, backgroundColor: '#C10104' }}></span>
          <span>Billing Questions</span>
          <span style={questionCountStyle}>2 (54.8%)</span>
        </div>
        <div style={questionTypeStyle}>
          <span style={{ ...dotStyle, backgroundColor: '#E9616D' }}></span>
          <span>Technical Questions</span>
          <span style={questionCountStyle}>6 (54.8%)</span>
        </div>
        <div style={questionTypeStyle}>
          <span style={{ ...dotStyle, backgroundColor: '#000D0F' }}></span>
          <span>Account Issues</span>
          <span style={questionCountStyle}>4 (71.6%)</span>
        </div>
        <div style={questionTypeStyle}>
          <span style={{ ...dotStyle, backgroundColor: '#808080' }}></span>
          <span>Other</span>
          <span style={questionCountStyle}>4 (64.3%)</span>
        </div>
      </div>
      <div className="mb-2" />
      <div className="flex justify-between items-left mb-2.5">
        <button
          className="flex items-center border-2 bg-gray-50 rounded-lg px-2 py-2 ml-auto"
          onClick={onRobotClick}
        >
          <img src={robot} width={20} height={10} alt="robot icon" />
        </button>
      </div>
      <div className="relative flex w-full justify-between items-center bg-[#f0f0f0] pt-3 px-2 pb-1">
        <span className="ml-1 text-black text-sm">View More</span>
        <img src={arrow} alt="arrow" />
      </div>
    </div>
  );
};

const containerStyle: React.CSSProperties = {
  border: '1px solid #e0e0e0',
  borderRadius: '8px',
  padding: '16px',
  maxWidth: '300px',
  margin: '0 auto',
  fontFamily: 'Arial, sans-serif',
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '16px',
};

const titleStyle: React.CSSProperties = {
  fontSize: '18px',
  fontWeight: 'bold',
};

const distributionStyle: React.CSSProperties = {
  marginBottom: '16px',
};

const distributionTextStyle: React.CSSProperties = {
  color: '#7F7F7F',
};

const distributionNumberStyle: React.CSSProperties = {
  fontSize: '24px',
  fontWeight: 'bold',
};

const percentageStyle: React.CSSProperties = {
  fontSize: '18px',
  color: '#7F7F7F',
};

const colorBarsContainerStyle: React.CSSProperties = {
  display: 'flex',
  gap: '4px',
  marginTop: '8px',
  overflowX: 'auto',
};

const colorBarStyle: React.CSSProperties = {
  borderRadius: '4px',
  height: '130px',
};

const questionTypesContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
};

const questionTypeStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
};

const dotStyle: React.CSSProperties = {
  width: '8px',
  height: '8px',
  borderRadius: '50%',
};

const questionCountStyle: React.CSSProperties = {
  marginLeft: 'auto',
  color: '#7F7F7F',
};

export default UnansweredQuestions;
