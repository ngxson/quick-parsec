
const request = require('request')
const savedData = require('../../utils/saved-data')
const navigate = require('../../utils/navigate')
var session_id = null
var listServer = []

$(() => {
  init()
})

async function init() {
  session_id = await savedData.get('session_id')
  if (!session_id) navigate('/activity/login/')
  refreshList()
}

function refreshList() {
  request({
    url: 'https://parsecgaming.com/v1/server-list?include_managed=true',
    method: 'post',
    headers: {
      'X-Parsec-Session-Id': session_id,
    }
  }, (err, res, body) => {
    body = JSON.parse(body)

    if (body.error) {
      alert(body.error)
      navigate('/activity/login/')
      return
    }

    listServer = body
    renderListServer()
  })
}

function renderListServer() {
  let buildServerEntry = (server, i) => {
    return `
      <div class="col-12">
          <b>${server.name}</b> (${server.status})<br>
          <button class="btn btn-success" onclick="btnSetDefault(${i})">Set default</button>&nbsp;&nbsp;
          <button class="btn btn-default" onclick="btnConnect(${i})">Connect</button>&nbsp;&nbsp;
      </div>
    `
  }
  let html = listServer.map(buildServerEntry).join('')
  console.log(html)
  $('#list-computers').html(html)
}
