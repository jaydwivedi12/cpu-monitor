import React, { useState } from 'react';
import axios from 'axios';

const StopProcess = () => {
  const [pid, setPid] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    e.preventDefault();
    const newValue = e.target.value;

    // Basic input validation (example)
    if (isNaN(newValue)) {
      setErrorMessage('Please enter a valid numeric PID.');
      return;
    }

    setPid(newValue);
    setErrorMessage(''); // Clear error message if valid input is entered
  };

  const handleStopProcess = async () => {
    try {
      console.log("fjsdhifd");
      const response = await axios.post('http://localhost:8000/api/terminateprocess', { pid });

      if (response.data.success) {
        console.log('Process stopped successfully');
      } else {
        setErrorMessage(response.data.error);
      }
    } catch (error) {
      console.error('Error stopping process:', error);
      setErrorMessage('An error occurred. Please try again later.');
    }
  };

  return (
    <div className='pt-24'>
    <h2 className="text-2xl font-semibold mb-4">Terminate Process</h2>
     {errorMessage && <p className="error-message text-red-500">{errorMessage}</p>}
    <div className='p-4 w-20'>
    <input
      onChange={handleChange}
      type="number"
      id="stopInput"
      placeholder='Enter Process Id'
      className="bg-black border p-2 text-white rounded-md "
      style={{ width: '200px' }}
    />

    <button
      onClick={handleStopProcess}
      className="bg-gray-800 text-white px-4 py-2 text-center rounded-md outline-none"
    >
      Stop
    </button>
    </div>
   
  </div>
  );
};

export default StopProcess;
