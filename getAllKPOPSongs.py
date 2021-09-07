from selenium import webdriver
from selenium.webdriver.support.ui import Select
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver import ActionChains
from webdriver_manager.chrome import ChromeDriverManager
import time
import json

PATH = "C:\Program Files (x86)\chromedriver.exe"
URL = "https://dbkpop.com/db/k-pop-music-videos"
FINAL = { 'data': [], 'summary': { 'highestViews': 0 , 'highestComments': 0,  'highestLikes': 0 , 'highestDislikes': 0 }}
ERROR_LOG = []

driver = webdriver.Chrome(ChromeDriverManager().install())
driver.get(URL)

try:
    time.sleep(5)
    print("Selecting All Entries")
    tableTag = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "table_1")))
    dropDownlist = Select(driver.find_element_by_name('table_1_length'))
    dropDownlist.select_by_visible_text("All")
    print("Waiting for Loading")
    time.sleep(25)
    print("Retrieve all Entries")
    rows = tableTag.find_elements_by_tag_name("tr")[2:]
    print(len(rows))

    for row in rows:
        rowData = {}
        cols = row.find_elements_by_tag_name("td")
        rowData['releaseDate'] = cols[1].text
        rowData['artist'] = cols[2].text
        rowData['songName'] = cols[3].text
        rowData['koreanSongName'] = cols[4].text
        rowData['director'] = cols[5].text
        aTag = cols[6].find_element_by_tag_name('a')
        rowData['videoLink'] = aTag.get_attribute('href')
        rowData['type'] = cols[7].text.capitalize()

        if len(rowData['type']) <= 4:
            rowData['type'] = rowData['type'] + ' Group'
        rowData['releaseType'] = cols[8].text
  
        print(rowData)
        FINAL['data'].append(rowData)
        print()
        print('---Next Row---')
        print()

    with open('kpopList.json', 'w') as file:
        json.dump(FINAL, file)

    with open('error_log.txt', 'w') as error_file:
        for line in ERROR_LOG:
            error_file.write(line + "\n");

except:
    print('error')








