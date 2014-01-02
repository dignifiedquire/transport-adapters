expect = require('chai').expect
SockStream = require('../').SockStream

noop = ->

describe 'browserchannel stream adapter', ->

  it 'exists', ->
    expect(SockStream).to.exist

  it 'throws when no connection is provided', ->
    expect(-> SockStream()).to.throw 'No connection object provided.'

