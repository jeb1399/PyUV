import subprocess
import os
import sys
import signal

def run_node_server():
    try:
        # Ensure all dependencies are installed
        subprocess.run(['npm', 'install'], check=True)
        
        # Run the Node.js server
        process = subprocess.Popen(['node', 'server.js'], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        
        # Forward stdout and stderr to Python's stdout and stderr
        while True:
            output = process.stdout.readline()
            if output == b'' and process.poll() is not None:
                break
            if output:
                sys.stdout.buffer.write(output)
                sys.stdout.buffer.flush()
        
        rc = process.poll()
        return rc

    except subprocess.CalledProcessError as e:
        print(f"An error occurred: {e}")
    except KeyboardInterrupt:
        print("Received interrupt signal. Shutting down...")
        process.send_signal(signal.SIGTERM)
        process.wait()

if __name__ == '__main__':
    # Change to the directory containing server.js
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    # Create public directory if it doesn't exist
    public_dir = os.path.join(os.getcwd(), 'public')
    if not os.path.exists(public_dir):
        os.makedirs(public_dir)
    
    # Create a basic 404.html file if it doesn't exist
    file_404 = os.path.join(public_dir, '404.html')
    if not os.path.exists(file_404):
        with open(file_404, 'w') as f:
            f.write("<html><body><h1>404 - Page Not Found</h1></body></html>")
    
    run_node_server()