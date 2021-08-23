
from flask import Flask, request, abort, jsonify
from flask_cors import CORS
import requests
from urllib.parse import urlencode

URL = 'https://api.nal.usda.gov/fdc/v1/foods/search?api_key=DEMO_KEY'
def create_app(test_config=None):
    app = Flask(__name__)
    CORS(app)

    def get_payload(request):
        page = request.args.get('page', 1, type=int)
        body = request.get_json()
        print("FULLFOOD", body['food'])
        return (
            {
                "query": "description:" + body['food'],
                "dataType": [
                    "Branded"
                ],
                "pageSize": 25,
                "pageNumber": page,
                "sortBy": "dataType.keyword",
                "sortOrder": "asc",
                "requireAllWords": True,
                "ingredients": " ".join(
                    list(map(lambda x: "+" + x.upper(), body['includeList'])) + 
                    list(map(lambda x: "-" + x.upper(), body['excludeList']))
                )
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
                            'ingredients': food['ingredients'] if 'ingredients' in food else "",
                            'gtinUpc': food['gtinUpc'] if 'gtinUpc' in food else "",
                        }
                    )
        return ret

    @app.route('/food', methods=['POST'])
    def search_food():
        body = request.get_json()
        payload = get_payload(request)
        r = requests.post(URL, json=payload)
        print("RESPONSE", r)
        if r.status_code == 200:
            return jsonify({
                'success': True,
                'data': parse_food_response(r.json())
            })
        else:
            abort(404)
    
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({
            'succcess': False,
            'error': 404,
            'message': 'resources not found'
        }), 404

    return app

