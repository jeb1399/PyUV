import subprocess

def run_node_server():
    try:
        subprocess.run(['node', 'server.js'], check=True)
    except subprocess.CalledProcessError as e:
        print(f"An error occurred: {e}")

if __name__ == '__main__':
    run_node_server()
