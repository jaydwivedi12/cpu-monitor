import { PythonShell } from 'python-shell';
import path from 'path';

const processLogs=async(req,res)=>{
    try {
        const pythonScriptPath = path.resolve('./PyScripts/anomalies.py');
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
                const filePath = path.resolve('../process_log.json');
                res.sendFile(filePath);
            }
        });
    } catch (err) {
        console.log(`Error in fetch log: ${err}`);
        res.status(500).json({ error: `Error in fetch log: ${err}` });
    }
}



export default processLogs;