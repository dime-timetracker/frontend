'use strict'

const m = require('src/lib/mithril')
const mq = require('mithril-query')
const login = require('./login')

describe('login', function () {
  let scope = {}
  beforeEach(function () {
    global.window = m.deps({
      localStorage: {},
      dimeDebug: () => {},
      navigator: global.navigator,
      document: global.document
    })
    global.window.navigator = { language: 'en' }
  })

  it('should render a greeting and an introduction text', function () {
    const out = mq(login.view(scope))
    out.should.have('h2')
    out.should.have('.introduction')
  })

  it('should render a login form', function () {
    const out = mq(login.view(scope))
    out.should.have('form#login')
    out.should.have('form#login input[type=text]#username')
    out.should.have('form#login input[type=password]#password')
    out.should.have('form#login input[type=submit]')
  })

  it('should render a registration form', function () {
    const out = mq(login.view(scope))
    out.should.have('form#registration')
    out.should.have('form#registration input[type=text]#username')
    out.should.have('form#registration input[type=text]#firstname')
    out.should.have('form#registration input[type=text]#lastname')
    out.should.have('form#registration input[type=email]#email')
    out.should.have('form#registration input[type=password]#password')
    out.should.have('form#registration input[type=submit]')
  })
})
