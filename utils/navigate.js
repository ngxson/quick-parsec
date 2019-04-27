
const path = require('path')
const url = require('url')

module.exports = (goto) => {
  window.location.href = url.format({
    pathname: path.join(__dirname, '..' + goto + '/index.html'),
    protocol: 'file:',
    slashes: true
  })
}