import json
import psutil
from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_PY = os.getenv('MONGO_PY')

def get_process_data():
    process_data = []
    
    for proc in psutil.process_iter(['pid', 'name', 'cpu_percent', 'memory_percent', 'num_threads', 'connections']):
        try:
            connections = proc.info['connections']
            # test_list = []
            # for i in range(12):
            #   p = psutil.Process(proc.pid)
            #   p_cpu = p.cpu_percent(interval=0.01)
            #   test_list.append(p_cpu)
            # cpu_percent=float(sum(test_list))/len(test_list)
            # print(test_list)
            
           
            cpu_percent= psutil.cpu_percent(interval=0, percpu=True)
            cpu_count=psutil.cpu_count
            cpu_percent=(sum(cpu_percent) / cpu_count()/12)
            
            # p = psutil.Process(proc.pid)
            # p.cpu_percent(interval=None)
            # for i in range(100):
            #     usage = p.cpu_percent(interval=None)
            # print(usage)
            
            # Extracting port numbers from connections
            
            port_numbers = [conn.laddr.port for conn in connections if conn.status == 'LISTEN']
        except psutil.AccessDenied:
            port_numbers = []
        
        process_data.append({
            'pid': proc.pid,
            'name': proc.info['name'],
            'cpu_percent': cpu_percent,
            'memory_percent': proc.info['memory_percent'],
            'num_threads': proc.info['num_threads'],
            'port_numbers': port_numbers
        })
    return process_data

def save_to_mongodb(data):
    client = MongoClient(MONGO_PY)  
    db = client['CPU-Monitor']  
    collection = db['process_data']

    # Replace existing data with the new process_data
    collection.replace_one({}, {'process_data': data}, upsert=True)

if __name__ == "__main__":
    processes = get_process_data()
    
    # Save to MongoDB
    save_to_mongodb(processes)
    
    # Save to JSON file
    json_output = json.dumps(processes, indent=4)
    save_path = "../process_data.json"
    with open(save_path, 'w') as f:
        f.write(json_output)
