from flask import Flask, request, abort, jsonify
from flask_cors import CORS
import requests
from urllib.parse import urlencode
import os
from dotenv import load_dotenv
import re
import math

API_KEY = os.getenv('API_KEY')
URL = f'https://api.nal.usda.gov/fdc/v1/foods/search?api_key={API_KEY}'


def ingredient_counter(lst):
    counter = {}
    for ingredients in lst:
        for ingredient in ingredients:
            if ingredient in counter:
                counter[ingredient] += 1
            else:
                counter[ingredient] = 1
    return counter



def get_payload(request, page):
    body = request.get_json()
    return (
        {
            'query': ('description:' + '"' + body['food'] + '"' if body['food'] != '' else '') + (' foodCategory:' + body['category'] if  body['category'] != '' else ''),
            'dataType': [
                'Branded'
            ],
            'pageSize': body['pageSize'],
            'pageNumber': page,
            'sortBy': 'dataType.keyword',
            'sortOrder': 'asc',
            'requireAllWords': True,
            'ingredients': ' '.join(
                list(map(lambda x: '+' + x.upper(), body['includeList'])) + 
                list(map(lambda x: '-' + x.upper(), body['excludeList']))
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
                        'brandCategory': food['brandCategory'] if 'brandCategory' in food else "",
                    }
                )
    return ret

def get_ingredient_list(data):
    ingreds_with_invalid = []
    ret = []
    removeList = ["", "FOLLOWING", "COLOR", "CONTAINS LESS THAN", "WITH", "INGREDIENTS", "LESS THAN", "ADDED", "CONTAINS", "OF", "OR", "LESS THAN", "WITH", "OF THE FOLLOWING", "OR LESS OF", "OR LESS OF THE FOLLOWING", "TO PROTECT FLAVOR"]
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

def create_app(test_config=None):
    app = Flask(__name__)
    CORS(app)

    @app.route('/food', methods=['POST'])
    def search_food():
        page = request.args.get('page', 1, type=int)
        payload = get_payload(request, page)
        r = requests.post(URL, json=payload)
        if r.status_code == 200:
            return jsonify({
                'success': True,
                'data': parse_food_response(r.json()),
                'totalHits': r.json()['totalHits'] if r.json()['totalHits'] <= 10000 else 10000
            })
        else:
            abort(404)
    
    @app.route('/all', methods=['POST'])
    def get_all():
        # get all of the search result
        page = 1
        result = []

        while True:
            payload = get_payload(request, page)
            r = requests.post(URL, json=payload)
            if r.status_code != 200:
                abort(404)
            r_json = r.json()
            totalHits = r_json['totalHits'] if r_json['totalHits'] <= 10000 else 10000
            result.extend(parse_food_response(r_json))
            if page >= math.ceil(totalHits / 200):
                break
            page += 1     
            
        return jsonify({
            'success': True,
            'result': result,
        })

    @app.route('/info', methods=['POST'])
    def get_info():
        ingredient_list = get_ingredient_list(request.get_json())
        counter = ingredient_counter(ingredient_list)
        top_50 = list(sorted(counter.items(), key=lambda item: item[1]))[-50:][::-1]        

        return jsonify({
            'success': True,
            'data': { 'common': top_50 }
        })
    
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({
            'success': False,
            'error': 404,
            'message': 'resources not found'
        }), 404

    return app

