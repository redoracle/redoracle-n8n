#!/usr/bin/env python3

import sys
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options

chrome_service = Service('/usr/bin/chromium-driver')
chrome_options = Options()
chrome_options.add_argument('--headless')
driver = webdriver.Chrome(service=chrome_service, options=chrome_options)

url = 'https://example.com'
if len(sys.argv) > 1:
    url = sys.argv[1]

driver.get(url)
print(driver.page_source)
driver.quit()