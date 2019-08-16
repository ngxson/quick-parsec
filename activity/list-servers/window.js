
const request = require('request')
const savedData = require('../../utils/saved-data')
const navigate = require('../../utils/navigate')
const daemon = require('../../utils/parsec-daemon')
const wol = require('../../utils/wol')
const { remote } = require('electron')
const path = require('path')
const url = require('url')
const BrowserWindow = remote.BrowserWindow
var session_id = null,
  default_server_id = null,
  listServer = []

$(() => {
  init()
  wol(savedData)
})

async function init() {
  session_id = await savedData.get('session_id')
  default_server_id = await savedData.get('server_id')
  default_server_build = await savedData.get('server_build')
  if (!session_id) navigate('/activity/login/')
  refreshList()
}

function refreshList() {
  request({
    url: 'https://kessel-api.parsecgaming.com/hosts',
    method: 'post',
    headers: {
      'Authorization': `Bearer ${session_id}`,
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
    setupRefreshTimer()
  })
}

function renderListServer() {
  let buildServerEntry = (server, i) => {
    let isDefault = default_server_id == server.server_id
    checkAutoConnect(i)
    return `
      <div class="col-12">
        ---------------<br>
        <b>${server.name}</b> (${server.status})<br>
        ${isDefault
          ? '<button class="btn btn-success" id="txt-auto-connect" onclick="btnAbortAutoConnect()">Open by default</button>'
          : '<button class="btn btn-default" onclick="btnSetDefault(' + i + ')">Set default</button>'
        }&nbsp;&nbsp;
        <button class="btn btn-default" onclick="btnConnect(${i})">Connect</button>&nbsp;&nbsp;
      </div>
    `
  }
  let html = listServer.map(buildServerEntry).join('')
  $('#list-computers').html(html)
}

var isConnecting = false
function btnConnect(i) {
  if (isConnecting) return
  isConnecting = true
  daemon.connect(session_id, listServer[i].server_id, listServer[i].build).then(status => {
    if (status == 0) {
      remote.app.exit()
      remote.getCurrentWindow().close()
    } else {
      isConnecting = false
    }
  })
}

function btnSetDefault(i) {
  autoConnectEnable = false
  savedData.save('server_id', listServer[i].server_id)
  savedData.save('server_build', listServer[i].build)
  default_server_id = listServer[i].server_id
  default_server_build = listServer[i].build
  renderListServer()
}

function logout() {
  savedData.save('session_id', null)
  navigate('/activity/login/')
}

var refreshTimerCount = 6
var refreshTimerId = 0
function setupRefreshTimer() {
  clearInterval(refreshTimerId)
  refreshTimerCount = 6
  refreshFunc = () => {
    if (refreshTimerCount == 0) {
      clearInterval(refreshTimerId)
      refreshList()
      $('#txt-refresh-in').text('Refreshing...')
    } else {
      refreshTimerCount -= 1
      $('#txt-refresh-in').text('Refresh in ' + refreshTimerCount + ' secs')
    }
  }
  refreshTimerId = setInterval(refreshFunc, 1000)
  refreshFunc()
}

var autoConnectTimerId = 0
var autoConnectTimerCount = 4
var autoConnectEnable = true
function checkAutoConnect(i) {
  if (!autoConnectEnable) return
  if (default_server_id == listServer[i].server_id && listServer[i].status === 'on') {
    let autoConnectTimerFunc = () => {
      if (autoConnectTimerCount == 0) {
        clearInterval(autoConnectTimerId)
        btnConnect(i)
        $('#txt-auto-connect').text('Connecting...')
      } else {
        autoConnectTimerCount -= 1
        $('#txt-auto-connect').text('Auto connect in ' + autoConnectTimerCount + ' secs. Click to abort')
      }
    }
    autoConnectTimerId = setInterval(autoConnectTimerFunc, 1000)
  }
}

function btnAbortAutoConnect() {
  autoConnectEnable = false
  clearInterval(autoConnectTimerId)
  $('#txt-auto-connect').text('Open by default')
}

function openWOL() {
  navigate('/activity/wol/')
}
