from flask import Flask, request, abort, jsonify
from flask_cors import CORS
import requests
from urllib.parse import urlencode
import os
from dotenv import load_dotenv
import math
from . import helper

API_KEY = os.getenv('API_KEY')
URL = f'https://api.nal.usda.gov/fdc/v1/foods/search?api_key={API_KEY}'


def create_app(test_config=None):
    app = Flask(__name__)
    CORS(app)

    @app.route('/food', methods=['POST'])
    def search_food():
        page = request.args.get('page', 1, type=int)
        payload = helper.get_payload(request, page)
        r = requests.post(URL, json=payload)
        if r.status_code == 200:
            return jsonify({
                'success': True,
                'data': helper.parse_food_response(r.json()),
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
            payload = helper.get_payload(request, page)
            r = requests.post(URL, json=payload)
            if r.status_code != 200:
                abort(404)
            r_json = r.json()
            totalHits = r_json['totalHits'] if r_json['totalHits'] <= 10000 else 10000
            result.extend(helper.parse_food_response(r_json))
            if page >= math.ceil(totalHits / 200):
                break
            page += 1     
            
        return jsonify({
            'success': True,
            'result': result,
        })

    @app.route('/info', methods=['POST'])
    def get_info():
        r_json = request.get_json()
        common_categories = helper.common_categories(r_json) # get 50 of the most common categories
        common_ingredients = helper.common_ingredients(r_json) # get 50 of the most common ingredients

        return jsonify({
            'success': True,
            'data': {
                 'common_ingredients': common_ingredients,
                 'common_categories': common_categories
            }
        })
    
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({
            'success': False,
            'error': 404,
            'message': 'resources not found'
        }), 404

    return app

