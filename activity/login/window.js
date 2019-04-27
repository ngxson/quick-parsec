
const request = require('request')
const savedData = require('../../utils/saved-data')
const navigate = require('../../utils/navigate')

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
      navigate('/activity/list-servers/')
    } else {
      alert('Unknown error')
    }
  })
}
