#!/usr/bin/env python3

import sys
import requests

if len(sys.argv) < 2:
    print("Usage: virusTotal_lookup.py <api_key> <target>")
    sys.exit(1)

api_key = sys.argv[1]
target = sys.argv[2] if len(sys.argv) > 2 else '8.8.8.8'
url = f'https://www.virustotal.com/api/v3/ip_addresses/{target}'
headers = {'x-apikey': api_key}

r = requests.get(url, headers=headers)
print(r.json())