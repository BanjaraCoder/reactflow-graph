import React, { useState, useEffect } from "react";
import searchIcon from '../../assets/search.svg';
import filterGovern from '../../assets/filter_govern.svg';
import categoryGovern from '../../assets/category_govern.svg';
import filter_line from '../../assets/filter_line.svg';

interface Data3 {
  question: string;
  category: string;
}

const Category_list1: React.FC = () => {
  const [data, setData] = useState<Data3[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>('');

  useEffect(() => {
    fetch('https://rapid-govern-be-bg36gz65wa-uc.a.run.app/get_unanswered_prompts_with_category', {
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
        const formattedData = data.unanswered_prompts_with_category.map((item: any) => ({
          question: item.question,
          category: item.category.trim() // Removing any leading/trailing whitespace
        }));
        setData(formattedData);
      })
      .catch((err) => console.error('Error fetching data:', err));
  }, []);

  const handleTagChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedTag(event.target.value);
  };

  const handleViewMore = () => {
    console.log('View More button clicked');
  };

  return (
      <div className="overflow-auto w-full h-full rounded-xl">
        <table className="min-w-full divide-y divide-gray-200 rounded">
          <thead className="bg-[#ebefef] text-[#7F8A8C] rounded">
            <tr >
              <th
                scope="col"
                className="h-12 text-center text-lg border-r border-gray-300 tracking-wider"
              >
                Unanswered Question
              </th>
              <th
                scope="col"
                className="h-12 text-center text-lg border-r border-gray-300 tracking-wider"
              >
                Topic
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item, index) => (
              <tr
                key={index}
                className={item.status === 0 ? "bg-red-100 hover:bg-gray-100 odd:bg-[#B4C0C2]/5 even:bg-[#B4C0C2]/6" : "hover:bg-gray-100 odd:bg-[#B4C0C2]/5 even:bg-[#B4C0C2]/6"}
              >
                <td className="h-12 text-left whitespace-nowrap text-sm text-gray-900 border-r border-gray-300">
                  {item.question}
                </td>
                <td className="h-12 text-center whitespace-nowrap text-sm text-gray-900 border-r border-gray-300">
                  {item.category}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
    </div>
  );
};

export default Category_list1;
