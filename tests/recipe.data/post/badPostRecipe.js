// This contains attempts to post recipes that have a missing property
const missingPostProperty = [ 
    {
        "timeRating": 2,
        "skillRating": 2,
        "userId": "aqNlzvS0VLQaVp8MSPGrpO8xJc83"
    },
    {
        "id": "4OVS8KrjAfdVds9tUGdm",
        "timeRating": 2,
        "skillRating": 3,
        "userId": "aqNlzvS0VLQaVp8MSPGrpO8xJc83"
    },
    {
        "id": "8mu5x0J9oNhNAo2YZalJ",
        "title": "burgir",
        "skillRating": 4,
        "userId": "DBeSxH2LuHPLzwVrnDbzgPm8Ai72"
    },
    {
        "id": "9zM97BpLbBDg3ZGnpT7X",
        "title": "Just a recipe",
        "timeRating": 1,
        "userId": "DBeSxH2LuHPLzwVrnDbzgPm8Ai72"
    },
    {
        "id": "DRE37SivI2isyB1ApRNN",
        "title": "Yeas",
        "timeRating": 2,
        "skillRating": 2,
    }
]

// This contains attempts to post recipes with properties of the wrong type
const badPostProperty = [
    {
        "id": "13GdPdi9e9FLoUReVZXH",
        "title": {title:"Yiper"},
        "timeRating": 2,
        "skillRating": 2,
        "userId": "aqNlzvS0VLQaVp8MSPGrpO8xJc83"
    },
    {
        "id": ["4OVS8KrjAfdVds9tUGdm"],
        "title": "test1",
        "timeRating": 2,
        "skillRating": 3,
        "userId": "aqNlzvS0VLQaVp8MSPGrpO8xJc83"
    },
    {
        "id": "8mu5x0J9oNhNAo2YZalJ",
        "title": "burgir",
        "timeRating": "3",
        "skillRating": 4,
        "userId": "DBeSxH2LuHPLzwVrnDbzgPm8Ai72"
    },
    {
        "id": "9zM97BpLbBDg3ZGnpT7X",
        "title": "Just a recipe",
        "timeRating": 1,
        "skillRating": {number: 2},
        "userId": "DBeSxH2LuHPLzwVrnDbzgPm8Ai72"
    },
    {
        "id": "DRE37SivI2isyB1ApRNN",
        "title": "Yeas",
        "timeRating": 2,
        "skillRating": 2,
        "userId":222313123
    }
]

module.exports = {
    missingPostProperty, 
    badPostProperty
}