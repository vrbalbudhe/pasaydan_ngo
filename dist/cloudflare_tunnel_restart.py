import subprocess
import time

def start_tunnel():
    while True:
        print("Starting Cloudflare Tunnel...")
        process = subprocess.Popen(["cloudflared", "tunnel", "--url", "http://localhost:3000"], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        
        # Monitor the process
        while True:
            output = process.stdout.readline()
            if output:
                print(output.decode().strip())
            
            # If the process exits, restart it
            if process.poll() is not None:
                print("Tunnel closed! Restarting in 5 seconds...")
                time.sleep(5)
                break  # Break the loop to restart the tunnel

if __name__ == "__main__":
    start_tunnel()
