API_KEY = <YOUR-API-KEY>

from googleapiclient.discovery import build
import json

def main():
  FINAL = { 'data': [], 'summary': { 'highestViews': 0 , 'highestComments': 0,  'highestLikes': 0 , 'highestDislikes': 0 }}
  ERROR_LOG = []
  youtube = build('youtube', 'v3', developerKey=API_KEY)

  with open('kpopList.json') as file:
    json_file = json.load(file)
    print(len(json_file['data']))
    for kpopVid in json_file['data']:
      videoId = kpopVid['videoLink'].split('/')[-1]
      #"youtubeViewCount": 1070159, "youtubeCommentCount": 1377, "youtubeLikeCount": 14506, "youtubeDislikeCount": 194, "youtubeLinkStatus": true
      request = youtube.videos().list(
        part="statistics",
        id=videoId
      )
      response = request.execute()
      try:
        stats = response['items'][0]['statistics']
        print(stats)
        kpopVid['youtubeViewCount'] = int(stats['viewCount'])
        if kpopVid['youtubeViewCount'] > FINAL['summary']['highestViews']:
          FINAL['summary']['highestViews'] = kpopVid['youtubeViewCount']

        kpopVid['youtubeCommentCount'] = int(stats['commentCount'])
        if kpopVid['youtubeCommentCount'] > FINAL['summary']['highestComments']:
          FINAL['summary']['highestComments'] = kpopVid['youtubeCommentCount']

        kpopVid['youtubeLikeCount'] = int(stats['likeCount'])
        if kpopVid['youtubeLikeCount'] > FINAL['summary']['highestLikes']:
          FINAL['summary']['highestLikes'] = kpopVid['youtubeLikeCount']

        kpopVid['youtubeDislikeCount'] = int(stats['dislikeCount'])
        if kpopVid['youtubeDislikeCount'] > FINAL['summary']['highestDislikes']:
          FINAL['summary']['highestDislikes'] = kpopVid['youtubeDislikeCount']

        kpopVid['youtubeLinkStatus'] = True
      except: 
        ERROR_LOG.append(kpopVid['videoLink'] + " (Failed)(Song Name: " + kpopVid['songName'] + ")")
        kpopVid['youtubeLinkStatus'] = False
      
      
      FINAL['data'].append(kpopVid)

  with open('kpopFINAL.json', 'w') as file:
        json.dump(FINAL, file)

if __name__ == "__main__":
    main()
