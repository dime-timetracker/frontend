'use strict'

/* based on https://github.com/jsguy/misojs-codemirror-component */
const m = require('mithril')

// 	Here we have a few fixes to make CM work in node - we only setup each,
//	if they don't already exist, otherwise we would override the browser
if (!global.document) {
  global.document = {}
}
if (!global.document.createElement) {
  global.document.createElement = global.document.createElement || function () {
    return {
      setAttribute: function () {}
    }
  }
}
if (!global.window) {
  global.window = {}
  global.window.getSelection = global.window.getSelection || function () {
    return false
  }
}
if (!global.navigator) {
  global.navigator = {
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.130 Safari/537.36'
  }
}

//	Grab code mirror and the javascript language
//	Note: you cannot dynamically require with browserify,
//	so we must get whatever modes we need here.
//	If you need other languages, simply equire them statically in your program.
var CodeMirror = require('codemirror')
require('codemirror/mode/javascript/javascript.js')
require('codemirror/mode/htmlmixed/htmlmixed.js')
require('codemirror/mode/css/css.js')

const CodemirrorComponent = {
  instance: null,
	//	Returns a textarea
  view: function (ctrl, attrs) {
    return m('div', [
      m('textarea', {config: CodemirrorComponent.config(attrs)}, attrs.value())
    ])
  },
  config: function (attrs) {
    return function (element, isInitialized) {
      if (typeof CodeMirror !== 'undefined') {
        if (!isInitialized) {
          CodemirrorComponent.instance = CodeMirror.fromTextArea(element, {
            lineNumbers: true,
            mode: 'text/javascript'
          })
          CodemirrorComponent.instance.on('change', function (instance, object) {
            m.startComputation()
            attrs.value(CodemirrorComponent.instance.doc.getValue())
            if (typeof attrs.onchange === 'function') {
              attrs.onchange(instance, object)
            }
            m.endComputation()
          })
        }
      } else {
        console.warn('ERROR: You need Codemirror in the page')
      }
    }
  },
  reload: function (newContent) {
    CodemirrorComponent.instance.doc.setValue(newContent)
  }
}

module.exports = CodemirrorComponent
