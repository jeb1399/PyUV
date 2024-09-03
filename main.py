import subprocess
import os

def run_node_server():
    try:
        subprocess.run(['npm', 'install'], check=True)
        subprocess.run(['node', 'server.js'], check=True)
    except subprocess.CalledProcessError as e:
        print(f"An error occurred: {e}")

if __name__ == '__main__':
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    run_node_server()
