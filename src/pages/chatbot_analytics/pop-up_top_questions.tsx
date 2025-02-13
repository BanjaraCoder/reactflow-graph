import React, { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import EditIcon from "../../assets/edit";
import Delete from "../../assets/delete";

interface Data2 {
  no: number;
  top_question: string;
  date: string;
  asked_count: number;
}

const TopUserQuestions: React.FC = () => {
  const [data, setData] = useState<Data2[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://rapid-govern-be-bg36gz65wa-uc.a.run.app/frequent_questions", {
          method: "GET",
          headers: new Headers({
            "ngrok-skip-browser-warning": "69420",
            "Accept": "application/json",
          }),
        });

        console.log("Response object:", response);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get("content-type");
        console.log("Content type:", contentType);

        const text = await response.text();
        console.log("Raw response text:", text);

        let result;
        if (!contentType || !contentType.includes("application/json")) {
          console.error("Response is not JSON:", text);

          // Example of parsing JSON data from HTML (this is not a recommended practice)
          // Adjust this logic based on your actual HTML content
          const jsonStringMatch = text.match(/{.*}/);
          if (jsonStringMatch) {
            const jsonString = jsonStringMatch[0];
            result = JSON.parse(jsonString);
          } else {
            throw new TypeError("Expected JSON response");
          }
        } else {
          result = JSON.parse(text); // Parse JSON manually
        }

        console.log("Parsed response data:", result);

        const fetchedData = result.frequent_questions && result.frequent_questions.map((item: any, index: number) => ({
          no: index + 1,
          top_question: item.question,
          date: item.date,
          asked_count: item.frequency,
        }));

        console.log("Mapped data:", fetchedData);

        if (fetchedData) {
          setData(fetchedData);
        } else {
          throw new Error("Invalid response structure");
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error); // Log error for debugging
        setError("Failed to fetch data. Please check the console for more details.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="overflow-auto h-64">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-[#f0f0f0] text-black font-bold">
          <tr className='hover:bg-gray-100 odd:bg-[#B4C0C2]/5 even:bg-[#B4C0C2]/6'>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs tracking-wider border-r border-gray-300"
            >
              No.
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs border-r border-gray-300 tracking-wider"
            >
              Top Questions
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs border-r border-gray-300 tracking-wider"
            >
              Asked Count
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs border-r border-gray-300 tracking-wider"
            >
              Date
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-300">
                {item.no}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-300">
                {item.top_question}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-300">
                {item.asked_count}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-300">
                {item.date}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TopUserQuestions;
