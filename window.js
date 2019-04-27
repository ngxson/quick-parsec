
const navigate = require('./utils/navigate')
const savedData = require('./utils/saved-data')

$(() => {
  init()
})

async function init() {
  let session_id = await savedData.get('session_id')
  if (!session_id) {
    navigate('/activity/login/')
  } else {
  }
}
