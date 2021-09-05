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
secondDriver = webdriver.Chrome(ChromeDriverManager().install())

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


        try:
            secondDriver.get(rowData['videoLink'])
            playButton = WebDriverWait(secondDriver, 10).until(EC.presence_of_element_located((By.CLASS_NAME, "ytp-play-button")))
            time.sleep(1)
            ActionChains(secondDriver).click(playButton).perform()
            print("Video Pause")
        except:
            print("Video Pause Error")

        
        try:
            # get views 
            viewsTag = WebDriverWait(secondDriver, 10).until(EC.presence_of_element_located((By.CLASS_NAME, "yt-view-count-renderer")))
            rowData['youtubeViewCount'] = int(viewsTag.text.split(' ')[0].replace(',', ''))
            if rowData['youtubeViewCount'] > FINAL['summary']['highestViews']:
                FINAL['summary']['highestViews'] = rowData['youtubeViewCount']
            print("Retrieved View")
        except:
            rowData['youtubeViewCount'] = 0
            print("Retrieved View Error")

        try:
            # get comments ytd-comments-header-renderer
            commentTag = WebDriverWait(secondDriver, 10).until(EC.presence_of_element_located((By.CSS_SELECTOR, "yt-formatted-string.count-text.style-scope.ytd-comments-header-renderer")))
            rowData['youtubeCommentCount'] = int(commentTag.text.split(' ')[0].replace(',', ''))
            if rowData['youtubeCommentCount'] > FINAL['summary']['highestComments']:
                FINAL['summary']['highestComments'] = rowData['youtubeCommentCount']
            print("Retrieved Comment")
        except:
            rowData['youtubeCommentCount'] = 0
            print("Retrieved Comment Error")

        # get likes
        try:
            likeTag = WebDriverWait(secondDriver, 10).until(EC.presence_of_element_located((By.CSS_SELECTOR, "yt-formatted-string.style-scope.ytd-toggle-button-renderer.style-text")))
            rowData['youtubeLikeCount'] = int(likeTag.get_attribute('aria-label').split(' ')[0].replace(',', ''))
            if rowData['youtubeLikeCount'] > FINAL['summary']['highestLikes']:
                FINAL['summary']['highestLikes'] = rowData['youtubeLikeCount']
            print("Retrieved Like")
        except:
            rowData['youtubeLikeCount'] = 0
            print("Retrieved Like Error")
        

        # get dislikes 
        try:
            dislikeTag = secondDriver.find_elements_by_css_selector("yt-formatted-string.style-scope.ytd-toggle-button-renderer.style-text")[1]
            rowData['youtubeDislikeCount'] = int(dislikeTag.get_attribute('aria-label').split(' ')[0].replace(',', ''))
            if rowData['youtubeDislikeCount'] > FINAL['summary']['highestDislikes']:
                FINAL['summary']['highestDislikes'] = rowData['youtubeDislikeCount']
            print("Retrieved Dislike")
        except:
            rowData['youtubeDislikeCount'] = 0
            print("Retrieved Dislike Error")
        
        if rowData['youtubeViewCount'] == 0 and rowData['youtubeCommentCount'] == 0 and rowData['youtubeLikeCount'] == 0 and rowData['youtubeDislikeCount'] == 0:
            print("Retrieving Youtube Data Failed")
            ERROR_LOG.append(rowData['videoLink'] + " (Failed)(Song Name: " + rowData['songName'] + ")")
            rowData['youtubeLinkStatus'] = False
        else:
            rowData['youtubeLinkStatus'] = True
            
        print(rowData)
        FINAL['data'].append(rowData)
        print()
        print('---Next Row---')
        print()
        time.sleep(1)

    with open('kpop.json', 'w') as file:
        json.dump(FINAL, file)

    with open('error_log.txt', 'w') as error_file:
        for line in ERROR_LOG:
            error_file.write(line + "\n");

except:
    print('error')








