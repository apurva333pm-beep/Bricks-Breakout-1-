import http.server
import socketserver
import subprocess
import os
import sys
import urllib.parse
import ctypes
import time
import threading

PORT = 8000
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
BREAKOUT_DIR = os.path.join(SCRIPT_DIR, "Breakout")
EXE_PATH = os.path.join(SCRIPT_DIR, "x64", "Release", "Breakout.exe")


def bring_window_to_front(process):
    """Wait for the game window to appear, then bring it to the foreground."""
    time.sleep(2)
    try:
        import ctypes
        from ctypes import wintypes

        user32 = ctypes.windll.user32
        kernel32 = ctypes.windll.kernel32

        # Find window by process ID
        pid = process.pid

        def callback(hwnd, results):
            tid, found_pid = ctypes.c_ulong(), ctypes.c_ulong()
            user32.GetWindowThreadProcessId(hwnd, ctypes.byref(found_pid))
            if found_pid.value == pid and user32.IsWindowVisible(hwnd):
                results.append(hwnd)
            return True

        WNDENUMPROC = ctypes.WINFUNCTYPE(ctypes.c_bool, ctypes.POINTER(ctypes.c_int), ctypes.POINTER(ctypes.c_int))
        results = []

        # Try multiple times
        for _ in range(10):
            results.clear()
            enum_func = WNDENUMPROC(callback)
            user32.EnumWindows(enum_func, ctypes.byref(ctypes.c_int(0)))
            if results:
                hwnd = results[0]
                user32.ShowWindow(hwnd, 9)  # SW_RESTORE
                user32.SetForegroundWindow(hwnd)
                user32.BringWindowToTop(hwnd)
                print(f"[LAUNCH] Brought game window to foreground (HWND: {hwnd})")
                return
            time.sleep(0.5)

        print("[LAUNCH] Could not find game window to bring to front")
    except Exception as e:
        print(f"[LAUNCH] Error bringing window to front: {e}")


class GameLauncherHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=BREAKOUT_DIR, **kwargs)

    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        super().end_headers()

    def do_GET(self):
        url = urllib.parse.urlparse(self.path)

        if url.path == "/launch":
            query = urllib.parse.parse_qs(url.query)
            level = query.get("level", ["0"])[0]

            print(f"[LAUNCH] Launching game at level {level}...")

            if not os.path.isfile(EXE_PATH):
                msg = f"ERROR: Breakout.exe not found at {EXE_PATH}"
                print(f"[ERROR] {msg}")
                self.send_response(500)
                self.send_header("Content-type", "text/plain")
                self.end_headers()
                self.wfile.write(msg.encode())
                return

            try:
                proc = subprocess.Popen(
                    [EXE_PATH, level],
                    cwd=BREAKOUT_DIR,
                    creationflags=subprocess.CREATE_NEW_PROCESS_GROUP
                )
                print(f"[LAUNCH] Game started with PID {proc.pid}")

                # Bring the game window to the front in a background thread
                t = threading.Thread(target=bring_window_to_front, args=(proc,), daemon=True)
                t.start()

                self.send_response(200)
                self.send_header("Content-type", "text/plain")
                self.end_headers()
                self.wfile.write(b"Game Launched")
            except Exception as e:
                msg = f"Error launching game: {e}"
                print(f"[ERROR] {msg}")
                self.send_response(500)
                self.send_header("Content-type", "text/plain")
                self.end_headers()
                self.wfile.write(msg.encode())
        else:
            return super().do_GET()


if __name__ == "__main__":
    os.chdir(SCRIPT_DIR)

    print("=" * 44)
    print("   SONIC BREAKOUT - Game Launcher Server")
    print("=" * 44)
    print(f"  Serving from : {BREAKOUT_DIR}")
    print(f"  Game exe     : {EXE_PATH}")
    print(f"  Exe exists   : {os.path.isfile(EXE_PATH)}")
    print()

    socketserver.TCPServer.allow_reuse_address = True
    try:
        with socketserver.TCPServer(("", PORT), GameLauncherHandler) as httpd:
            print(f"  >> Open http://localhost:{PORT} in your browser")
            print(f"  >> Press Ctrl+C to stop\n")
            httpd.serve_forever()
    except OSError as e:
        print(f"ERROR: Port {PORT} in use: {e}")
        sys.exit(1)
    except KeyboardInterrupt:
        print("\nShutting down...")
        sys.exit(0)
