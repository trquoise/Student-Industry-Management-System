import json

data = {
    'key1': 'value1',
    'key2': 'value2',
    'key3': 'value3'
}

json_str = json.dumps(data)

print(type(json_str), json_str)