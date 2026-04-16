from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import argparse
import os


class CORSRequestHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "*")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(204)
        self.end_headers()


def main():
    parser = argparse.ArgumentParser(description="Simple static file server with CORS enabled")
    parser.add_argument("--host", default="127.0.0.1", help="Host to bind")
    parser.add_argument("--port", type=int, default=8000, help="Port to bind")
    parser.add_argument("--dir", default=".", help="Directory to serve")
    args = parser.parse_args()

    os.chdir(args.dir)
    server = ThreadingHTTPServer((args.host, args.port), CORSRequestHandler)
    print(f"Serving {os.getcwd()} at http://{args.host}:{args.port} with CORS enabled")
    server.serve_forever()


if __name__ == "__main__":
    main()
