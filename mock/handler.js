const bodyParser = require('body-parser')
const utils = require('./utils')

module.exports = (req, res, next) => {
  // get corresponding config for current request
  console.log('handle');
  
  try {
    var conf = utils.readJSON(__dirname + req.path + '.json')
  } catch (err) {
    console.log(err)
    return next()
  }
  
  const responseName = conf.responseName
  
  // paging
  if (conf.isPaging && conf.datasource.indexOf(responseName) === 0) {
    let datasource = utils.getValue(conf.response, conf.datasource)
    let page = req.query.pageNum || req.body.pageNum || 1
    utils.setValue(conf.response, conf.datasource, utils.paging(datasource, page, 3))
  }
  
  // get response
  const response = conf.response[responseName]
  
  // res.send(response)
  
  // simulate network latency
  setTimeout(() => {
    res.send(response)
  }, conf.delay)
}

