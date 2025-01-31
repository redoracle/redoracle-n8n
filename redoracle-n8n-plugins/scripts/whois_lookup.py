#!/usr/bin/env python3

import sys
import subprocess

target = sys.argv[1] if len(sys.argv) > 1 else 'example.com'
result = subprocess.run(['whois', target], capture_output=True, text=True)
print(result.stdout)