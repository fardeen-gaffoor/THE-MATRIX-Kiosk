#!/bin/bash
# Restore script
echo "Starting Restore..."
# gpg -d backup.sql.gpg | psql -U postgres db
# mc mirror backup_s3/ minio/kiosk
echo "Restore complete."
