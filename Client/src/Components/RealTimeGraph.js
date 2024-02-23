import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProcessData } from '../Redux/processSlice';

const RealTimeGraph = () => {
  const dispatch = useDispatch();
  const processData = useSelector((state) => state.process.data);
  const cpuChartRef = useRef(null);
  const memoryChartRef = useRef(null);

  useEffect(() => {
    // Fetch process data when the component mounts
    dispatch(fetchProcessData());

    // Fetch process data every 1 second (adjust as needed)
    const intervalId = setInterval(() => {
      dispatch(fetchProcessData());
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [dispatch]);

  useEffect(() => {
    // Draw or update the CPU chart when processData changes
    const aggregateData = () => {
      // Aggregate logic
      const aggregatedData = {
        cpu_percentages: Array(100).fill(0),
        memory_percentages: Array(100).fill(0),
      };

      processData.forEach((process) => {
        const cpuIndex = Math.round(process.cpu_percent);
        aggregatedData.cpu_percentages[cpuIndex] += 1;

        const memoryIndex = Math.round(process.memory_percent);
        aggregatedData.memory_percentages[memoryIndex] += 1;
      });

      // Normalize data
      const totalProcesses = processData.length;
      aggregatedData.cpu_percentages = aggregatedData.cpu_percentages.map((count) => (count / totalProcesses) * 100);
      aggregatedData.memory_percentages = aggregatedData.memory_percentages.map((count) => (count / totalProcesses) * 100);

      return aggregatedData;
    };

    if (cpuChartRef.current && processData.length > 0) {
      const aggregatedData = aggregateData();

      const cpuChart = new window.Chart(cpuChartRef.current, {
        type: 'bar',
        data: {
          labels: Array.from({ length: 30 }, (_, i) => i + 1),
          datasets: [
            {
              label: 'CPU Utilization',
              backgroundColor: 'rgba(255, 99, 132, 0.6)', // Red
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1,
              hoverBackgroundColor: 'rgba(255, 99, 132, 0.8)',
              hoverBorderColor: 'rgba(255, 99, 132, 1)',
              data: aggregatedData.cpu_percentages.slice(0, 30),
            },
          ],
        },
        options: {
          scales: {
            x: {
              type: 'linear',
              stacked: true,
              display: false,
              min: 0,
              max: 30,
            },
            y: {
              stacked: true,
              beginAtZero: true,
              max: 100,
              title: {
                display: true,
                text: 'Percentage (%)',
              },
            },
          },
          plugins: {
            legend: {
              display: false,
            },
          },
        },
      });

      return () => cpuChart.destroy(); // Cleanup chart on component unmount
    }
  }, [processData]);

  useEffect(() => {
    // Draw or update the memory chart when processData changes
    const aggregateData = () => {
      // Aggregate logic
      const aggregatedData = {
        cpu_percentages: Array(100).fill(0),
        memory_percentages: Array(100).fill(0),
      };

      processData.forEach((process) => {
        const cpuIndex = Math.round(process.cpu_percent);
        aggregatedData.cpu_percentages[cpuIndex] += 1;

        const memoryIndex = Math.round(process.memory_percent);
        aggregatedData.memory_percentages[memoryIndex] += 1;
      });

      // Normalize data
      const totalProcesses = processData.length;
      aggregatedData.cpu_percentages = aggregatedData.cpu_percentages.map((count) => (count / totalProcesses) * 100);
      aggregatedData.memory_percentages = aggregatedData.memory_percentages.map((count) => (count / totalProcesses) * 100);

      return aggregatedData;
    };

    if (memoryChartRef.current && processData.length > 0) {
      const aggregatedData = aggregateData();

      const memoryChart = new window.Chart(memoryChartRef.current, {
        type: 'bar',
        data: {
          labels: Array.from({ length: 30 }, (_, i) => i + 1),
          datasets: [
            {
              label: 'Memory Utilization',
              backgroundColor: 'rgba(30, 144, 255, 0.6)', // Dodger Blue
              borderColor: 'rgba(30, 144, 255, 1)',
              borderWidth: 1,
              hoverBackgroundColor: 'rgba(30, 144, 255, 0.8)',
              hoverBorderColor: 'rgba(30, 144, 255, 1)',
              data: aggregatedData.memory_percentages.slice(0, 30),
            },
          ],
        },
        options: {
          scales: {
            x: {
              type: 'linear',
              stacked: true,
              display: false,
              min: 0,
              max: 30,
            },
            y: {
              stacked: true,
              beginAtZero: true,
              max: 100,
              title: {
                display: true,
                text: 'Percentage (%)',
              },
            },
          },
          plugins: {
            legend: {
              display: false,
            },
          },
        },
      });

      return () => memoryChart.destroy(); // Cleanup chart on component unmount
    }
  }, [processData]);

  return (
    <div>
      <div>
        <h2>CPU Utilization</h2>
        <canvas ref={cpuChartRef} width="400" height="300"></canvas>
      </div>
      <div>
        <h2>Memory Utilization</h2>
        <canvas ref={memoryChartRef} width="400" height="300"></canvas>
      </div>
    </div>
  );
};

export default RealTimeGraph;
