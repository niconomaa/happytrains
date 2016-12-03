import json
from graphqlclient import GraphQLClient

client = GraphQLClient('https://api.graph.cool/simple/v1/ciw9brm021bfh0171mp8tiric')

get_trainlines_answers_query = '''
query trainlinesAndAnswers {
  	allTrainlines {
  		id
    	name
    	answers {
			anger
	  		disgust
      		fear
      		joy
      		sadness
    }
  }
}
'''

trainlines_and_answers = json.loads(client.execute(get_trainlines_answers_query))["data"]["allTrainlines"]


for all_trainlines in trainlines_and_answers:
	trainline_id = all_trainlines["id"]
	number_of_answers = 0
	sentiment_Avg = {"avgAnger": 0, "avgDisgust": 0, "avgFear": 0, "avgJoy": 0, "avgSadness": 0}
	for answer in all_trainlines["answers"]:
		number_of_answers += 1
		sentiment_Avg["avgAnger"] += answer["anger"]
		sentiment_Avg["avgDisgust"] += answer["disgust"]
		sentiment_Avg["avgFear"] += answer["fear"]
		sentiment_Avg["avgJoy"] += answer["joy"]
		sentiment_Avg["avgSadness"] += answer["sadness"]
	if number_of_answers != 0:
		for sentiment in sentiment_Avg:
			sentiment_Avg[sentiment] /= number_of_answers
	mutation = '''
    mutation {{
      updateTrainline(id: "{}" avgSadness: {} avgDisgust: {} avgAnger: {} avgJoy: {}, avgFear: {}){{
      		id
      }}
    }}
    '''.format(trainline_id, sentiment_Avg["avgSadness"], sentiment_Avg["avgDisgust"], sentiment_Avg["avgAnger"], sentiment_Avg["avgJoy"], sentiment_Avg["avgFear"])
	result = client.execute(mutation)






# get_all_answers_query = '''
# query all
# {
#   allAnswers {
#     id
#     text
#   }
# }
# '''
# all_answers = json.loads(client.execute(get_all_answers_query))["data"]["allAnswers"]


# get_all_trainline_names = '''
# query trainlinenames {
#   allTrainlines {
#     name
#   }
# }
# '''


# all_trainline_names = json.loads(client.execute(get_all_trainline_names))["data"]["allTrainlines"]

# trainlinenames = []
# numberoftrains = 0

# for  trainlinename in all_trainline_names:
# 	trainlinenames.append(trainlinename["name"])
# 	numberoftrains+= 1

# print(trainlinenames) 



# dict = {'Name': 'Zara', 'Age': 7, 'Class': 'First'}



# avgAnger = {'U1': 0 , 'U2' 0, 0, 0, 0, 0, 0, 0, 0}
# avgDisgust = [0 , 0, 0, 0, 0, 0, 0, 0, 0]
# avgFear = [0 , 0, 0, 0, 0, 0, 0, 0, 0]
# avgJoy = [0 , 0, 0, 0, 0, 0, 0, 0, 0]
# avgSadness = [0 , 0, 0, 0, 0, 0, 0, 0, 0]


# for allAnswers in all_answers:
# 	for trainlines in allAnswers[Trainlines]
# 		avgAnger 	+= allAnswers[sad]
# 		avgDisgust 	+= 0
# 		avgFear 	+= 0
# 		avgJoy 		+= 0
# 		avgSadness 	+= 


# print(result)