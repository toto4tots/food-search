from collections import Counter
import re

def ingredient_counter(lst):
    counter = Counter()
    for ingredients in lst:
        for ingredient in ingredients:
            counter[ingredient] += 1
    return counter

def category_counter(lst):
    counter = Counter()
    for category in lst:
        counter[category] += 1
    return counter

def common_categories(data, quantitiy=50):
    categories = [food['foodCategory'] for food in data if food['foodCategory'] != ""]
    counter = list(sorted(category_counter(categories).items(), key=lambda item: item[1]))[-quantitiy:][::-1]  
    return counter

def common_ingredients(data, quantitiy=50):
    ingredient_list = get_ingredient_list(data)
    counter = ingredient_counter(ingredient_list)
    ret = list(sorted(counter.items(), key=lambda item: item[1]))[-quantitiy:][::-1]  
    return ret

def get_payload(request, page):
    body = request.get_json()
    return (
        {
            'query': ('description:' + '"' + body['food'] + '"' if body['food'] != '' else '') + (' foodCategory:' + '"' + body['category'] + '"' if  body['category'] != '' else ''),
            'dataType': [
                'Branded'
            ],
            'pageSize': body['pageSize'],
            'pageNumber': page,
            'sortBy': 'dataType.keyword',
            'sortOrder': 'asc',
            'requireAllWords': True,
            'ingredients': ' '.join(
                list(map(lambda x: '+"' + x.upper() + '"', body['includeList'])) + 
                list(map(lambda x: '-"' + x.upper() + '"', body['excludeList']))
            ),             
        }
    )

def parse_food_response(data):
    ret = []
    if 'foods' in data:
        food_data = data['foods']
        for food in food_data:
            if 'description' in food:
                ret.append(
                    {
                        'description': food['description'] if 'description' in food else "",
                        'brandOwner': food['brandOwner'] if 'brandOwner' in food else "",
                        'brandName': food['brandName'] if 'brandName' in food else "",  
                        'ingredients': food['ingredients'].upper() if 'ingredients' in food else "",
                        'gtinUpc': food['gtinUpc'] if 'gtinUpc' in food else "",
                        'foodCategory': food['foodCategory'] if 'foodCategory' in food else "",
                    }
                )
    return ret

def get_ingredient_list(data):
    ingreds_with_invalid = []
    ret = []
    removeList = ["", "CONTAINS ONE OR MORE OF THE FOLLOWING", "OR LESS OF EACH OF THE FOLLOWING", "FOLLOWING", "COLOR", "CONTAINS LESS THEN", "CONTAINS LESS THAN", "WITH", "INGREDIENTS", "LESS THAN", "ADDED", "A", "CONTAINS", "OF", "OR", "LESS THAN", "WITH", "OF THE FOLLOWING", "OR LESS OF", "OR LESS OF THE FOLLOWING", "TO PROTECT FLAVOR", "MONO", "TO PROTECT FRESHNESS", "COLOR ADDED", "TO PROTECT COLOR", "TO PROMOTE COLOR RETENTION", "REDUCED", "EXTRACTS OF", "CONCENTRATES OF", "L", "STRAIGHT", "TO PROTECT TASTE", "THICKEN"]
    for food in data:    
        temp = re.sub(r'[^A-Za-z ]+', ',', food['ingredients'])
        ingreds_with_invalid.append(set(f.strip("* ") for f in temp.split(',')))

    for entry in ingreds_with_invalid:
        newEntry = []
        for food in entry:
            for invalid in removeList:
                if food == invalid:
                    break
            else:
                newEntry.append(food)
        ret.append(newEntry)
    return ret