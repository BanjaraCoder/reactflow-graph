import React, { useState, useEffect } from "react";

interface LatestPrompt {
  date: string;
  question: string;
}

const NewQuestion: React.FC = () => {
  const [data, setData] = useState<LatestPrompt[]>([]);

  useEffect(() => {
    fetch('https://rapid-govern-be-bg36gz65wa-uc.a.run.app/latest_prompts', {
      method: 'GET',
      headers: new Headers({
        'ngrok-skip-browser-warning': '69420',
        'Accept': 'application/json',
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Fetched data:', data);
        const formattedData = data.latest_prompts.map((item: any) => ({
          date: item.date,
          question: item.question,
        }));
        setData(formattedData);
      })
      .catch((err) => console.error('Error fetching data:', err));
  }, []);

  return (
    <div>
      <div className="rounded-xl mt-5 p-4 bg-white">
        {/* Table */}
        <div className="overflow-auto h-64 mt-4">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#f0f0f0] text-black font-bold">
              <tr className='hover:bg-gray-100 odd:bg-[#B4C0C2]/5 even:bg-[#B4C0C2]/6'> 
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs border-r border-gray-300 tracking-wider"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs border-r border-gray-300 tracking-wider"
                >
                  Question
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-300">
                    {item.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-300">
                    {item.question}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default NewQuestion;
