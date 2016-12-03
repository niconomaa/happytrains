import json
from graphqlclient import GraphQLClient
import csv

client = GraphQLClient('https://api.graph.cool/simple/v1/ciw9brm021bfh0171mp8tiric')

# for each train line:
    # get all average values

get_all_trainslines_query = '''
query
all {
  allTrainlines {
    name
    id
    avgAnger
    avgSadness
    avgJoy
    avgFear
    avgDisgust
  }
}
'''
all_trainlines = json.loads(client.execute(get_all_trainslines_query))["data"]["allTrainlines"]



# get all answers and match them to their respective train line

get_all_answers_query = '''
query
all {
  allAnswers {
    trainline{
        name
    }
    text
  }
}
'''

all_answers = json.loads(client.execute(get_all_answers_query))["data"]["allAnswers"]



overview = {}

for trainline in all_trainlines:
    # print("""
    # The average joy of people riding on {} is {}%. \n
    # The average anger of people riding on {} is {}%. \n\n
    # """.format(
    # trainline["name"], float(trainline["avgJoy"]) * 100,
    # trainline["name"], float(trainline["avgAnger"]) * 100,
    # ))
    # print("""
    # People are saying the following things about {}
    # """.format(trainline["name"]))
    overview[trainline["name"]] = {}
    overview[trainline["name"]]["avgSadness"] = trainline["avgSadness"]
    overview[trainline["name"]]["avgFear"] = trainline["avgFear"]
    overview[trainline["name"]]["avgDisgust"] = trainline["avgDisgust"]
    overview[trainline["name"]]["avgJoy"] = trainline["avgJoy"]
    overview[trainline["name"]]["answers"] = []
    for answer in all_answers:
        if(answer["trainline"]["name"] == trainline["name"]):
            # print(answer["text"] + "\n")
            overview[trainline["name"]]["answers"].append(answer["text"])

for key, val in overview.items():
    print(key,val)

with open('traindata.csv', 'wb') as f:
    w = csv.DictWriter(f, overview.keys())
    w.writeheader()
    w.writerow(overview)
