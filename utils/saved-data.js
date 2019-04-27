
const os = require('os')
const storage = require('electron-json-storage')
const FILE_NAME = 'quick-parsec-data'

storage.setDataPath(os.tmpdir())

module.exports = {
  save: (key, value) => {
    storage.get(FILE_NAME, (error, data) => {
      if (!data) data = {}
      data[key] = value
      storage.set(FILE_NAME, data)
    })
  },
  get: (key) => {
    return new Promise(resolve => {
      storage.get(FILE_NAME, (error, data) => {
        resolve(data ? data[key] : null)
      })
    })
  }
}
