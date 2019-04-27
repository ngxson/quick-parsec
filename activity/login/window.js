
const request = require('request')
const savedData = require('../../utils/saved-data')

$(() => {
  init()
})

async function init() {
  $('#email').val((await savedData.get('email')) || '')
  $('#btnLoading').hide()
}

function doLogin() {
  $('#btnLogin').hide()
  $('#btnLoading').show()
  savedData.save('email', $('#email').val())
  request({
    url: 'https://parsecgaming.com/v1/auth',
    method: 'post',
    json: {
      email: $('#email').val(),
      password: $('#password').val(),
    }
  }, (err, res, body) => {
    $('#btnLogin').show()
    $('#btnLoading').hide()
    if (body.error) {
      alert(body.error)
    } else if (body.session_id) {
      savedData.save('session_id', body.session_id)
      // TODO: redirect to home
    } else {
      alert('Unknown error')
    }
  })
}
