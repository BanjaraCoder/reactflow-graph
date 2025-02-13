import React, { useState, useEffect } from 'react';

interface Data3 {
  category: string;
  cat_desc: string;

}

const Category_list: React.FC = () => {
  const [categories, setCategories] = useState<Data3[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>(''); // State for selected tag
  const handleTagChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedTag(event.target.value);
  };

  useEffect(() => {
    fetch('https://rapid-govern-be-bg36gz65wa-uc.a.run.app/getCurrentCategories', {
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
        const formattedData = data.categories.map((item: any) => ({
          category: item.category,
          cat_desc: item.cat_desc,

        }));
        setCategories(formattedData);
      })
      .catch((err) => console.error('Error fetching data:', err));
  }, []);

  return (
      <div className="overflow-auto h-full">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-[#ebefef] text-[#7F8A8C] rounded">
            <tr className='hover:bg-gray-100 odd:bg-[#B4C0C2]/5 even:bg-[#B4C0C2]/6'>
              <th
                scope="col"
                className="h-12 text-left px-6  text-lg border-r border-gray-300 tracking-wider"
              >
                Topic
              </th>
              <th
                scope="col"
                className="h-12 text-left px-6  text-lg border-r border-gray-300 tracking-wider"
              >
                Description
              </th>

            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories.length === 0 ? (
              <tr className='hover:bg-gray-100 odd:bg-[#B4C0C2]/5 even:bg-[#B4C0C2]/6'>
                <td colSpan={3} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  No data available
                </td>
              </tr>
            ) : (
              categories.map((item, index) => (
                <tr key={index} className="hover:bg-gray-100 odd:bg-[#B4C0C2]/5 even:bg-[#B4C0C2]/6">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-300 ">
                    {item.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-300">
                    {item.cat_desc}
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
  );
};

export default Category_list;
