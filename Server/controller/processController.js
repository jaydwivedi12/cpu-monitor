import { exec } from "child_process";
import { PythonShell } from 'python-shell';
import path from 'path';

export const allProcess = async (req, res) => {    
    try {
        const pythonScriptPath = path.resolve('./PyScripts/main.py');
        let pyshell = new PythonShell(pythonScriptPath);

        pyshell.on('message', function(message) {
            console.log(message);
        });

        pyshell.end(function (err) {
            if (err) {
                console.error('PythonShell error:', err);
                res.status(500).json({ error: `PythonShell error: ${err}` });
            } else {
                console.log('PythonShell finished.');
                const filePath = path.resolve('../process_data.json');
                res.sendFile(filePath);
            }
        });
    } catch (err) {
        console.log(`Error in fetch process data: ${err}`);
        res.status(500).json({ error: `Error in fetch process data: ${err}` });
    }
}


function killProcessByPID(pid, res) {
    exec(`taskkill /F /PID ${pid}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            res.status(500).json({ error: `Error: ${error.message}` });
            return;
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            res.status(500).json({ error: `stderr: ${stderr}` });
            return;
        }
        console.log(`Process with PID ${pid} terminated successfully`);
        res.json({ message: `Process with PID ${pid} terminated successfully` });
    });
}

export const terminate = (req,res)=>{
    const {pid} = req.body;
    killProcessByPID(pid,res);
}


