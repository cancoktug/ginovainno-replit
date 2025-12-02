#!/bin/bash
sshpass -p 'ZqYWCgBs71' ssh -o StrictHostKeyChecking=no -p 49636 root@185.171.24.91 'ls -lh ginova-part-* 2>/dev/null || echo "Files not found yet"'
