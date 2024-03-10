'use strict'
const he = require('he')

// Need to review this function

const unescapeJson = (jsonObj) => {
  try{
    if (typeof jsonObj === 'object') {
      if (Array.isArray(jsonObj)) {
        return jsonObj.map(item => unescapeJson(item))
      } else {
        const result = {}
        for (const key in jsonObj) {
          if (jsonObj.hasOwnProperty(key)) {
            result[key] = unescapeJson(jsonObj[key])
          }
        }
        return result
      }
    } else if (typeof jsonObj === 'string') {
      return he.escape(jsonObj, {'strict': true})
    } else {
      return jsonObj
    }
  }

  catch (error) {
    console.log(error)
  }
}

module.exports = unescapeJson