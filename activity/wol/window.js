
const savedData = require('../../utils/saved-data')
const { remote } = require('electron')
const navigate = require('../../utils/navigate')

$(() => {
  init()
})

async function init() {
  $('#mac').val((await savedData.get('wol_mac')) || '')
  $('#ip').val((await savedData.get('wol_ip')) || '')
  $('#port').val((await savedData.get('wol_port')) || '')
}

function save() {
  let saveAsync = async () => {
    await savedData.save('wol_mac', $('#mac').val())
    await savedData.save('wol_ip', $('#ip').val())
    await savedData.save('wol_port', $('#port').val())
    back()
  }
  saveAsync()
}

function back() {
  navigate('/activity/list-servers/')
}
