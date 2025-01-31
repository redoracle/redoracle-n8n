#!/usr/bin/env python3

import sys
import shodan

if len(sys.argv) < 2:
    print("Usage: shodan_lookup.py <api_key> <ip>")
    sys.exit(1)

api_key = sys.argv[1]
ip = sys.argv[2] if len(sys.argv) > 2 else '8.8.8.8'

api = shodan.Shodan(api_key)
result = api.host(ip)
print(result)