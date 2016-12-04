import json
import csv
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
    topic
  }
}
'''

all_answers = json.loads(client.execute(get_all_answers_query))["data"]["allAnswers"]



overview = {}

for trainline in all_trainlines:

    overview[trainline["name"]] = {}
    overview[trainline["name"]]["avgSadness"] = trainline["avgSadness"] * 100
    overview[trainline["name"]]["avgFear"] = trainline["avgFear"] * 100
    overview[trainline["name"]]["avgDisgust"] = trainline["avgDisgust"] * 100
    overview[trainline["name"]]["avgJoy"] = trainline["avgJoy"] * 100
    overview[trainline["name"]]["avgAnger"] = trainline["avgAnger"] * 100
    overview[trainline["name"]]["answers"] = []
    for answer in all_answers:
        if(answer["trainline"]["name"] == trainline["name"]):
            # print(answer["text"] + "\n")
            overview[trainline["name"]]["answers"].append([answer["text"], answer["topic"]])

for key, val in overview.items():
    print(key,val)


# write all  analysis to a json file

with open('traindata.csv', 'wb') as f:
    w = csv.DictWriter(f, overview.keys())
    w.writeheader()
    w.writerow(overview)
