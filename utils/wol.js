var wol = require('node-wol');

module.exports = async (savedData) => {
  let mac = await savedData.get('wol_mac')
  let ip = await savedData.get('wol_ip')
  let port = await savedData.get('wol_port')

  if (!mac || mac === '') return
  if (ip == '') ip = null
  if (port == '') port = null

  wol.wake(mac, {
    address: ip,
    port: port ? parseInt(port) : null
  }, () => console.log)
}