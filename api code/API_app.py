from flask import Flask, jsonify, request
from flask_cors import CORS
import pymongo


connection_url = 'mongodb+srv://admin:prasanna123@basecluster-wbmpt.mongodb.net/Website?retryWrites=true&w=majority'

app = Flask(__name__)
CORS(app)

client = pymongo.MongoClient(connection_url)
ApiDatabase = client.get_database('Website')

Products = ApiDatabase.Products
SiteData = ApiDatabase.SiteData


@app.route('/get-all-products/', methods=['GET'])
def getAllProducts():
    query = Products.find()
    output = []
    for x in query:
        del x['_id']
        output.append(x)
    return jsonify({'result': output})


@app.route('/get-product/<pid>/', methods=['GET'])
def getProductData(pid):
    queryObj = {'ProductID': pid}
    query = Products.find_one(queryObj)
    del query['_id']
    return jsonify({'result': query})


@app.route('/get-new-pid/', methods=['GET'])
def getNewPid():
    pid = SiteData.find_one({'Data': 'NextProductID'})
    pid = 'P'+str(pid['NextProductID'])
    return jsonify({'result': pid})


def increasePid():
    pid = SiteData.find_one({'Data': 'NextProductID'})
    pid['NextProductID'] += 1
    query = SiteData.update_one({'Data': 'NextProductID'}, {
                                '$set': pid}, upsert=True)


@app.route('/add-product/', methods=['POST'])
def addProduct():
    pid = request.json['PID']
    queryObj = {
        'ProductID': pid,
        'Name': request.json['Name'],
        'Specifications': request.json['Specifications'],
        'ImageURLs': request.json['Images'],
        'Price': request.json['Price'],
        'Availability': request.json['Availability']
    }
    query = Products.update_one(
        {'ProductID': pid}, {'$set': queryObj}, upsert=True)

    output = {'result': 'Added'}
    increasePid()
    return jsonify(output)


@app.route('/delete-product/', methods=['POST'])
def deleteProduct():
    pid = request.json['PID']
    queryObj = {'ProductID': pid}
    query = Products.delete_one(queryObj)
    return jsonify({'result': 'Data Deleted...'})


@app.route('/save-details/', methods=['POST'])
def saveDetails():
    queryObj = {
        'Data': 'Details',
        'Details': {'Name': request.json['Name'],
                    'Address': request.json['Address'],
                    'PhoneNumber': request.json['PhoneNumber'],
                    'Email': request.json['Email']
                    }
    }
    query = SiteData.update_one(
        {'Data': 'Details'}, {'$set': queryObj}, upsert=True)
    return jsonify({'result': 'Saved Successfully'})


@app.route('/get-details/', methods=['GET'])
def getDetails():
    query = SiteData.find_one({'Data': 'Details'})
    query = query['Details']
    output = {}

    output['Name'] = query['Name']
    output['Address'] = query['Address']
    output['Email'] = query['Email']
    output['PhoneNumber'] = query['PhoneNumber']
    return jsonify({'result': output})


if __name__ == '__main__':
    app.run(debug=True)
