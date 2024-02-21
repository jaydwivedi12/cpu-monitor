import React from 'react';

const ProcessTable = ({ processData }) => {
  return (
    <> 
      <h2 className=" p-6 text-2xl font-semibold mb-4">Process Data Table</h2>
    <div className="h-[60vh] overflow-y-auto">
      <table className="min-w-full bg-gray-800 text-white border border-gray-700">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">PID</th>
            <th className="py-2 px-4 border-b">Process Name</th>
            <th className="py-2 px-4 border-b">CPU Utilization</th>
            <th className="py-2 px-4 border-b">Memory Utilization</th>
            <th className="py-2 px-4 border-b">Port Numbers</th>
          </tr>
        </thead>
        <tbody>
          {processData.map((process) => (
            <tr key={process.pid} className="hover:bg-gray-700">
              <td className="py-2 px-4 border-b text-center">{process.pid}</td>
              <td className="py-2 px-4 border-b text-center">{process.name}</td>
              <td className="py-2 px-4 border-b text-center">{(process.cpu_percent).toFixed(2)}%</td>
              <td className="py-2 px-4 border-b text-center">{process.memory_percent.toFixed(2)}%</td>
              <td className="py-2 px-4 border-b text-center">{process.port_numbers.join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  );
};

export default ProcessTable;
