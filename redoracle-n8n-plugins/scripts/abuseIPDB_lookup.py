#!/usr/bin/env python3

import sys
import requests

if len(sys.argv) < 2:
    print("Usage: abuseIPDB_lookup.py <api_key> <ip>")
    sys.exit(1)

api_key = sys.argv[1]
ip = sys.argv[2] if len(sys.argv) > 2 else '8.8.8.8'

url = 'https://api.abuseipdb.com/api/v2/check'
params = {'ipAddress': ip}
headers = {
    'Key': api_key,
    'Accept': 'application/json'
}
resp = requests.get(url, params=params, headers=headers)
print(resp.json())