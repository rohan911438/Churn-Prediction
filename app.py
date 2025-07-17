"""
Simple web server to serve the HTML/CSS/JS churn prediction application
This replaces the Streamlit app to avoid TensorFlow compatibility issues
"""
import os
import webbrowser
import http.server
import socketserver
import threading
import time
from pathlib import Path

def start_server(port=8000):
    """Start a simple HTTP server to serve the HTML application"""
    
    # Get the directory where this script is located
    web_dir = Path(__file__).parent
    
    # Change to the web directory
    os.chdir(web_dir)
    
    # Set up the server
    handler = http.server.SimpleHTTPRequestHandler
    
    try:
        with socketserver.TCPServer(("", port), handler) as httpd:
            print(f"🚀 Starting Churn Prediction Web Server...")
            print(f"📂 Serving files from: {web_dir}")
            print(f"🌐 Server running at: http://localhost:{port}")
            print(f"📱 Open the above URL in your browser to use the application")
            print(f"⏹️  Press Ctrl+C to stop the server")
            
            # Automatically open the browser
            def open_browser():
                time.sleep(1)  # Wait a second for server to start
                webbrowser.open(f'http://localhost:{port}')
            
            # Start browser opening in a separate thread
            browser_thread = threading.Thread(target=open_browser)
            browser_thread.daemon = True
            browser_thread.start()
            
            # Start the server
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\n👋 Server stopped by user")
    except OSError as e:
        if "Address already in use" in str(e):
            print(f"❌ Port {port} is already in use. Trying port {port + 1}...")
            start_server(port + 1)
        else:
            print(f"❌ Error starting server: {e}")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")

def check_files():
    """Check if required files exist"""
    required_files = ['index.html', 'styles.css', 'script.js']
    missing_files = []
    
    for file in required_files:
        if not os.path.exists(file):
            missing_files.append(file)
    
    if missing_files:
        print("❌ Missing required files:")
        for file in missing_files:
            print(f"   - {file}")
        print("\n💡 Please make sure all HTML, CSS, and JS files are in the same directory as this script.")
        return False
    
    print("✅ All required files found!")
    return True

def main():
    """Main function to run the web application"""
    print("=" * 60)
    print("🏦 BANK CUSTOMER CHURN PREDICTION WEB APPLICATION")
    print("=" * 60)
    print()
    
    # Check if required files exist
    if not check_files():
        input("\nPress Enter to exit...")
        return
    
    print("🔧 Features available:")
    print("   ✓ Modern responsive web interface")
    print("   ✓ Interactive prediction forms")
    print("   ✓ Real-time analytics dashboard")
    print("   ✓ Mobile-friendly design")
    print("   ✓ Works without TensorFlow dependencies")
    print()
    
    try:
        # Start the web server
        start_server()
    except Exception as e:
        print(f"❌ Failed to start application: {e}")
        input("\nPress Enter to exit...")

if __name__ == "__main__":
    main()
