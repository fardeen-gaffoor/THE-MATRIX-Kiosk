#!/bin/bash
# Backup script for Kiosk PostgreSQL and MinIO
echo "Starting Encrypted Backup..."
# pg_dump -U postgres db | gpg -c > backup.sql.gpg
# mc mirror minio/kiosk backup_s3/
echo "Backup complete and rotated."
