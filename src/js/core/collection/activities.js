'use strict';

var Collection = require('../Collection');
var Model = require('../model/Activity');
var lastUpdate = require('../helper/compare/activityLastUpdate');

module.exports = new Collection({
  resourceUrl: 'activity',
  model: Model,
  compare: function (a, b) {
    var result = 0;
    if (a > b) {
      result = -1;
    } else if (a < b) {
      result = 1;
    }
    return result;
  },
  compareKey: lastUpdate
}, [
    {
        "id": 1580,
        "description": "tesdt",
        "rate": null,
        "rateReference": null,
        "createdAt": "2015-05-29 15:04:15",
        "updatedAt": "2015-06-04 14:12:57",
        "customer":
        {
            "id": 11,
            "name": "Classic Lounge",
            "alias": "cl",
            "createdAt": "2012-08-01 09:35:12",
            "updatedAt": "2012-08-01 09:38:15",
            "rate": "0.00",
            "enabled": 0
        },
        "project": null,
        "service":
        {
            "id": 11,
            "name": "Bugfix",
            "alias": "bugfix",
            "description": null,
            "rate": null,
            "createdAt": "2012-10-17 10:28:51",
            "updatedAt": "2012-10-17 10:28:51"
        },
        "timeslices":
        [
            {
                "id": 2025,
                "duration": 479,
                "startedAt": "2015-06-04 12:15:28",
                "stoppedAt": "2015-06-04 12:23:27",
                "createdAt": "2015-06-04 12:15:28",
                "updatedAt": "2015-06-04 12:23:27"
            },
            {
                "id": 2026,
                "duration": 69,
                "startedAt": "2015-06-04 13:56:18",
                "stoppedAt": "2015-06-04 13:57:27",
                "createdAt": "2015-06-04 13:56:18",
                "updatedAt": "2015-06-04 13:57:27"
            },
            {
                "id": 2027,
                "duration": 119,
                "startedAt": "2015-06-04 13:57:31",
                "stoppedAt": "2015-06-04 13:59:30",
                "createdAt": "2015-06-04 13:57:31",
                "updatedAt": "2015-06-04 13:59:30"
            },
            {
                "id": 2028,
                "duration": 36,
                "startedAt": "2015-06-04 13:59:50",
                "stoppedAt": "2015-06-04 14:00:26",
                "createdAt": "2015-06-04 13:59:50",
                "updatedAt": "2015-06-04 14:00:26"
            },
            {
                "id": 2029,
                "duration": 4,
                "startedAt": "2015-06-04 14:01:01",
                "stoppedAt": "2015-06-04 14:01:05",
                "createdAt": "2015-06-04 14:01:01",
                "updatedAt": "2015-06-04 14:01:05"
            },
            {
                "id": 2030,
                "duration": 6,
                "startedAt": "2015-06-04 14:03:05",
                "stoppedAt": "2015-06-04 14:03:11",
                "createdAt": "2015-06-04 14:03:05",
                "updatedAt": "2015-06-04 14:03:11"
            },
            {
                "id": 2032,
                "duration": 6,
                "startedAt": "2015-06-04 14:03:22",
                "stoppedAt": "2015-06-04 14:03:28",
                "createdAt": "2015-06-04 14:03:22",
                "updatedAt": "2015-06-04 14:03:28"
            },
            {
                "id": 2033,
                "duration": 3,
                "startedAt": "2015-06-04 14:12:54",
                "stoppedAt": "2015-06-04 14:12:57",
                "createdAt": "2015-06-04 14:12:55",
                "updatedAt": "2015-06-04 14:12:57"
            }
        ],
        "tags":
        [
        ]
    },
    {
        "id": 1579,
        "description": "tesdt",
        "rate": null,
        "rateReference": null,
        "createdAt": "2015-05-29 15:02:49",
        "updatedAt": "2015-06-04 14:03:26",
        "customer":
        {
            "id": 11,
            "name": "Classic Lounge",
            "alias": "cl",
            "createdAt": "2012-08-01 09:35:12",
            "updatedAt": "2012-08-01 09:38:15",
            "rate": "0.00",
            "enabled": 0
        },
        "project": null,
        "service": null,
        "timeslices":
        [
            {
                "id": 2031,
                "duration": 7,
                "startedAt": "2015-06-04 14:03:19",
                "stoppedAt": "2015-06-04 14:03:26",
                "createdAt": "2015-06-04 14:03:19",
                "updatedAt": "2015-06-04 14:03:26"
            }
        ],
        "tags":
        [
        ]
    }]);