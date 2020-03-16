import requests
import csv
import pytz
import datetime

host = 'http://localhost:8081/api/'

local = pytz.timezone("America/Los_Angeles")


def get_utc(date, time):
    naive = datetime.datetime.strptime(date + " " + time, "%Y-%m-%d %H:%M:%S")
    local_dt = local.localize(naive, is_dst=None)
    utc_dt = local_dt.astimezone(pytz.utc)

    timestamp = int(utc_dt.timestamp())

    return timestamp


def post_data():
    with open('./Traffic_Speed_Counts.csv', newline='') as csvfile:
        reader = csv.reader(csvfile, delimiter=',', quotechar='|')
        next(reader)
        for id, row in enumerate(reader):
            start_date = row[7].split('T')[0]
            start_time = row[9]

            end_date = row[10].split('T')[0]
            end_time = row[12]

            payload = {
                'id': id,
                'location': [
                    float(row[1]),
                    float(row[0])
                ],
                'name': row[5],
                'volume': int(row[13]),
                'startTime': get_utc(start_date, start_time),
                'endTime': get_utc(end_date, end_time)
            }

            res = requests.post(host + 'traffic', data=payload)
            print('Adding ' + str(id) + ' to database. Status: ' + str(res.status_code))


def main():
    post_data();
    # print("Testing /cameras")
    # print("  GET")
    # get_cameras = requests.get(host + 'cameras')
    # print(get_cameras.status_code)
    # print(get_cameras.json())
    #
    # object_id = '42849'
    # object_payload = {
    #     'id': object_id,
    #     'className': 'vehicle',
    #     'timestamp': '482739434',
    #     'camera': '4',
    #     'properties': {
    #         'c': '0.9',
    #         'w': '473',
    #         'h': '342',
    #         'x': '234',
    #         'y': '343'
    #     }
    # }
    #
    # post_objects = requests.post(host + 'objects', data=object_payload)
    # print(post_objects.status_code)
    # print(post_objects.json())
    #
    # get_objects = requests.get(host + 'objects/' + object_id)
    # print(get_objects.status_code)
    # print(get_objects.json())
    #
    # get_records = requests.get(host + 'records')
    # print(get_records.status_code)
    # print(get_records.json())


if __name__ == '__main__':
    main()
