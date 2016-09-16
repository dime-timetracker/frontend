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

  it('should render a login form', function () {
    const out = mq(login.view(scope))
    out.should.have('form#login')
    out.should.have('form#login input[type=text]#username')
    out.should.have('form#login input[type=password]#password')
    out.should.have('form#login input[type=submit]')
  })
})
