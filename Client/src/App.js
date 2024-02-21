import ProcessLog from "./Components/ProcessLog";
import RealTimeGraph from "./Components/RealTimeGraph";
import RealTimeTable from "./Components/RealTimeTable";
import StopProcess from "./Components/StopProcess";


function App() {
  return (
    <>
      <div className="flex justify-center items-center gap-10">
        <div className="w-1/2 h-[100vh]">
          <RealTimeTable />
          <ProcessLog />
        </div>
        <div>
          <RealTimeGraph />
          <StopProcess />
        </div>
      </div>
    </>
  );
}

export default App;
