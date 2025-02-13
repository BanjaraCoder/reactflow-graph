import React from "react";

const FrequentReferencedDocuments: React.FC = ({
  frequentReferencedDocuments,
}) => {
  return (
    <div className="overflow-auto w-full h-full rounded-xl">
      <table className="min-w-full divide-y divide-gray-200 rounded">
        <thead className="bg-[#ebefef] text-[#7F8A8C] rounded">
          <tr>
            <th
              scope="col"
              className=" h-12 text-center text-lg border-r border-gray-300 tracking-wider"
            >
              Document
            </th>
            <th
              scope="col"
              className="h-12 text-center text-lg border-r border-gray-300 tracking-wider"
            >
              Page
            </th>
            <th
              scope="col"
              className="h-12 text-center text-lg border-r border-gray-300 tracking-wider"
            >
              Reference Count
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {frequentReferencedDocuments.length > 0 ? (
            frequentReferencedDocuments.map((doc, docIndex) => (
              <tr key={docIndex} className='hover:bg-gray-100 odd:bg-[#B4C0C2]/5 even:bg-[#B4C0C2]/6'>
                <td className="h-12 text-left whitespace-nowrap text-sm text-gray-900 border-r border-gray-300">
                  {doc.doc}
                </td>
                <td className="h-12 text-center whitespace-nowrap text-sm text-gray-900 border-r border-gray-300">
                  {doc.page}
                </td>
                <td className="h-12 text-center whitespace-nowrap text-sm text-gray-900 border-r border-gray-300">
                  {doc.reference_count}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={3}
                className="h-12 text-center text-sm text-gray-900"
              >
                No FrequentReferencedDocuments available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default FrequentReferencedDocuments;
