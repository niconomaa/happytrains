import json
from watson_developer_cloud import ToneAnalyzerV3
from graphqlclient import GraphQLClient

client = GraphQLClient('https://api.graph.cool/simple/v1/ciw9brm021bfh0171mp8tiric')

# get all answer ids and texts that dont have any evaluationy yet

get_all_answers_query = '''
query
all {
  allAnswers {
    id
    text
  }
}
'''
all_answers = json.loads(client.execute(get_all_answers_query))["data"]["allAnswers"]


for answer in all_answers:
    print(answer)


#  analyze text for all ideas and write analysis to answer

for answer in all_answers:

    tone_analyzer = ToneAnalyzerV3(
       username='b89a4c6a-673e-46b8-aa66-9b0272ea4c52',
       password='dFo4Er2Njuht',
       version='2016-05-19')

    text = answer["text"]

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


    query = '''
    mutation {{
      updateAnswer(id: "{}" sadness: {} disgust: {} anger: {} joy: {}, fear: {}) {{
        text
        anger
        joy
      }}
    }}
    '''.format(answer["id"], emotions['sadness'], emotions['disgust'], emotions['anger'], emotions['joy'], emotions["fear"])



    result = client.execute(query)
    print(result)
