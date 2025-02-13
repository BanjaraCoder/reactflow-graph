import React from "react";

const UsersByAgent: React.FC = ({ usersByAgent }) => {

  return (
        <div className="overflow-auto w-full h-full rounded-xl">
          <table className="min-w-full divide-y divide-gray-200 rounded">
            <thead className="bg-[#ebefef] text-[#7F8A8C] rounded">
              <tr>
                <th
                  scope="col"
                  className="h-12 text-center text-lg border-r border-gray-300 tracking-wider"
                >
                  Agent Name
                </th>
                <th
                  scope="col"
                  className="h-12 text-center text-lg border-r border-gray-300 tracking-wider"
                >
                  Agent ID
                </th>
                <th
                  scope="col"
                  className="h-12 text-center text-lg border-r border-gray-300 tracking-wider"
                >
                  No. of Users
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {usersByAgent.map((item, index) => (
                <tr key={index} className='hover:bg-gray-100 odd:bg-[#B4C0C2]/5 even:bg-[#B4C0C2]/6'>
                  <td className="h-12 whitespace-nowrap text-sm text-gray-900 border-r border-gray-300">
                    {item.agent_name}
                  </td>
                  <td className="h-12 text-center whitespace-nowrap text-sm text-gray-900 border-r border-gray-300">
                    {item.agent_id}
                  </td>
                  <td className="h-12 text-center whitespace-nowrap text-sm text-gray-900 border-r border-gray-300">
                    {item.user_count}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
  );
};

export default UsersByAgent;
