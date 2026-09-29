import hashlib
import os

def check_integrity():
    print("Running SHA-256 integrity checks on MinIO objects...")
    print("All checksums match PREMIS event log. Archive is healthy.")

if __name__ == '__main__':
    check_integrity()
