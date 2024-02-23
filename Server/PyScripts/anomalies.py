import psutil
import time
import joblib
import json
import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load the Isolation Forest model
script_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(script_dir, 'model.pkl')

try:
    model = joblib.load(model_path)
except Exception as e:
    logger.error(f"Error loading the model: {e}")
    exit(1)

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

# Define a function to detect outliers and save data to a JSON file
def detect_outliers(process_data):
    outliers = []
    for i, proc_info in enumerate(process_data):
        outlier = model.predict([list(proc_info.values())[2:]])  # Use only the numerical features
        if outlier == -1:
            outliers.append(proc_info)
            logger.info(f"Process with PID {proc_info['pid']} is identified as an outlier. Take action!")

    # Save outliers to a JSON file
    if outliers:
        json_file_path = os.path.join(script_dir, 'process_log.json')
        try:
            with open(json_file_path, 'a') as json_file:
                json.dump(outliers, json_file, indent=2)
        except Exception as e:
            logger.error(f"Error saving outliers to JSON file: {e}")

# Continuously collect live process data and detect outliers
try:
    while True:
        # Get live process data
        process_data = get_process_data()

        # Detect outliers and save to JSON file
        detect_outliers(process_data)

        # Add some delay before collecting the next set of live data
        time.sleep(5)  # Adjust the delay time as needed
except KeyboardInterrupt:
    logger.info("KeyboardInterrupt received. Exiting.")
