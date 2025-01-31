#!/usr/bin/env python3
# Esempio di lookup con GeoLite2: posiziona 'GeoLite2-City.mmdb' in /app
import sys
import geoip2.database

target_ip = sys.argv[1] if len(sys.argv) > 1 else '8.8.8.8'
reader = geoip2.database.Reader('/app/GeoLite2-City.mmdb')
response = reader.city(target_ip)
print(response.city.name)
reader.close()