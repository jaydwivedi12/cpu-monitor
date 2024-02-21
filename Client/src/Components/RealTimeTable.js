
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProcessData } from '../Redux/processSlice';
import ProcessTable from './ProcessTable';

const RealTimeTable = () => {
  const dispatch = useDispatch();
  const processData = useSelector((state) => state.process.data);

  useEffect(() => {
    // Fetch process data when the component mounts
    dispatch(fetchProcessData());

    // Fetch process data every 1 seconds (adjust as needed)
    const intervalId = setInterval(() => {
      dispatch(fetchProcessData());
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [dispatch]);

  return (
    <div>
      {/* Render other components or graphs as needed */}
      <ProcessTable processData={processData} />
    </div>
  );
};

export default RealTimeTable;
