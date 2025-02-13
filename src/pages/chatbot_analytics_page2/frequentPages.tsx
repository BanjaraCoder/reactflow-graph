import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import FrequentReferencedDocuments from "./frequentPagesPopup";
import arrow from "../../assets/arrow-right-up-line.svg";
import rightArrow from "../../assets/rightarrow.svg";
import downArrow from "../../assets/downArrowGray.svg";
import refresh from "../../assets/refreshGray.svg";
import { Modal } from "react-responsive-modal";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import FrequentPdfPage from "./frequentPdfPage";

ChartJS.register(
  Tooltip,
  CategoryScale,
  BarElement,
  Legend,
  Title,
  LinearScale
);

const API_ROUTE =
  "https://rapid-govern-be-bg36gz65wa-uc.a.run.app/frequent_referenced_documents";

const fetchDocuments = async () => {
  try {
    const fetchDocuments = await fetch(API_ROUTE, {
      method: "GET",
      headers: new Headers({
        "ngrok-skip-browser-warning": "69420",
        Accept: "application/json",
      }),
    });
    const frequentDocuments = await fetchDocuments.json();
    console.log(
      "frequentDocuments",
      frequentDocuments.frequent_referenced_documents
    );
    return frequentDocuments.frequent_referenced_documents;
  } catch (e) {
    console.error("API Error: /frequent_referenced_documents", e);
  }
};

const FrequentPages = () => {
  const [documentData, setDocumentData] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    const getFrequentlyReferencedPages = async () => {
      const documents = await fetchDocuments();
      setDocumentData(documents);
    };
    getFrequentlyReferencedPages();
  }, []);

  const labels = documentData.map((item) => `${item.doc} (Page ${item.page})`);
  const counts = documentData.map((item) => item.reference_count);

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Referred Count",
        data: counts,
        backgroundColor: "#ff6666ff",
        borderRadius: 5,
        maxBarThickness: 40,
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
          text: "Document",
          color: "black",
          padding: {
            top: 20,
          },
        },
        ticks: {
          color: "black",
          callback: function (value) {
            const label = this.getLabelForValue(value);
            if (label.length > 10) {
              return label.substring(0, 10) + "..."; // Truncate long labels
            }
            return label;
          },
        },
      },
      y: {
        title: {
          display: true,
          text: "Referred Count",
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
    <div className="h-full rounded-lg flex flex-col">
      <div className="border-b h-20 rounded-t-lg flex items-center box-border px-4 justify-between">
        <h1 className="text-[1vw] font-bold">Frequently Referenced Pages</h1>
        <div className="flex items-center space-x-3 text-sm">
          <button className="border border-[#7F8A8C] flex items-center gap-2 px-2 h-10 rounded-lg">
            August <img src={rightArrow} className="h-4 w-4" alt="" /> Present{" "}
            <img src={downArrow} className="w-3 h-3" alt="" />
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
      <div className=" flex">
        <div className=" h-full w-4/6 flex justify-center items-center px-8">
          <div className="h-[90%] w-full flex">
            <Bar data={chartData} options={options} />
          </div>
        </div>
        <div className=" scrollable overflow-y-auto h-[29rem] w-2/6 p-4 box-border">
          {documentData.map((pdf) => (
            <FrequentPdfPage pdfName={pdf.doc} page={pdf.page} />
          ))}
        </div>
      </div>
      <Modal open={isPopupOpen} onClose={() => setIsPopupOpen(false)} center>
        <FrequentReferencedDocuments
          frequentReferencedDocuments={documentData}
        />
      </Modal>
    </div>
  );
};

export default FrequentPages;
