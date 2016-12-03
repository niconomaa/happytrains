import json
from watson_developer_cloud import ToneAnalyzerV3
from graphqlclient import GraphQLClient

client = GraphQLClient('https://api.graph.cool/simple/v1/ciw9brm021bfh0171mp8tiric')

# get all answer ids and texts that dont have any evaluationy yet
    # store those in dict: id:text

#  analyze text for all ideas and write analysis to answer

get_all_answers_query =




tone_analyzer = ToneAnalyzerV3(
   username='b89a4c6a-673e-46b8-aa66-9b0272ea4c52',
   password='dFo4Er2Njuht',
   version='2016-05-19')

text = response = raw_input("How was your train ride today?")


response = json.dumps(tone_analyzer.tone(text=text, tones = "emotion"))

responsedict = json.loads(response)

emotions = {}

for key, val in responsedict.items():
    if type(val) is dict:
        for valkey, valval in val.items():
            for item in valval:
                for itemkey, itemval in item.items():
                    if type(itemval) is list:
                        for item in itemval:
                            emotions[item['tone_id']] = item["score"]

for key in emotions:
    print(key)


query = '''
mutation {{
  updateAnswer(id: "ciw9c5qi1008l0164mhnm7vhs" sadness: {} disgust: {} anger: {} joy: {}) {{
    sadness
    disgust
  }}
}}
'''.format(emotions['sadness'], emotions['disgust'], emotions['anger'], emotions['joy'])



result = client.execute(query)
print(result)
