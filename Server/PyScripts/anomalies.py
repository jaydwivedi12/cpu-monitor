import psutil
import time
import joblib
import pymongo
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_PY = os.getenv('MONGO_PY')

# Load the Isolation Forest model
script_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(script_dir, 'model.pkl')

model = joblib.load(model_path)


# Set up MongoDB connection 
mongo_client = pymongo.MongoClient(MONGO_PY)
db = mongo_client["CPU-Monitor"]
collection = db["processlog"]


# Define a function to get live process data
def get_process_data():
    processes = []
    for proc in psutil.process_iter(['pid', 'name', 'cpu_percent', 'memory_percent', 'num_threads', 'io_counters', 'open_files']):
        cpu_percent = proc.info['cpu_percent']
        memory_percent = proc.info['memory_percent']
        num_threads = proc.info['num_threads']
        
        # Disk usage related features
        try:
            disk_usage = psutil.disk_usage('/').percent  # Get disk usage for the root directory
        except psutil.AccessDenied:
            disk_usage = 0.0
        
        # IO counters related features
        io_counters = proc.info['io_counters']
        if io_counters:
            io_read_bytes = io_counters.read_bytes
            io_write_bytes = io_counters.write_bytes
        else:
            io_read_bytes = 0
            io_write_bytes = 0
        
        # Open files related features
        open_files_count = len(proc.info['open_files']) if proc.info['open_files'] is not None else 0
        
        # Get current timestamp
        current_time = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime())
        
        processes.append({
            'timestamp': current_time,
            'pid': proc.info['pid'],
            'name': proc.info['name'],
            'cpu_percent': cpu_percent,
            'memory_percent': memory_percent,
            'num_threads': num_threads,
            'disk_usage': disk_usage,
            'io_read_bytes': io_read_bytes,
            'io_write_bytes': io_write_bytes,
            'open_files_count': open_files_count
        })
    return processes

# Define a function to detect outliers and take action
def detect_outliers(process_data):
    for i, proc_info in enumerate(process_data):
        outlier = model.predict([list(proc_info.values())[2:]])  # Use only the numerical features
        if outlier == -1:
            collection.replace_one({}, {'processlog': proc_info['pid']}, upsert=True)
            print(f"Process with PID {proc_info['pid']} is identified as an outlier. Take action!")

# Continuously collect live process data and detect outliers
try:
    while True:
        # Get live process data
        process_data = get_process_data()
        
        # Detect outliers and take action
        detect_outliers(process_data)
        
        # Add some delay before collecting the next set of live data
        time.sleep(5)  # Adjust the delay time as needed
except KeyboardInterrupt:
    pass
