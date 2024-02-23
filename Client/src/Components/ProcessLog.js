import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProcessLog = () => {
  const [logData, setLogData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/log');
        const newData = await response.json();

        // Append new data to the existing logData
        setLogData((prevData) => [newData, ...prevData]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const interval = setInterval(fetchData, 500); // Fetch data every 0.5 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount

  }, []); // Empty dependency array ensures useEffect runs only once on component mount

  return (
    <div className='py-5'>
      <h2 className="text-2xl font-semibold mb-4">Process logs</h2>
      <div className="p-6 bg-black text-white h-[100px] overflow-y-auto">
        {logData.map((log, index) => (
          <p key={index}>{log}</p>
        ))}
      </div>
    </div>
  );
};

export default ProcessLog;
