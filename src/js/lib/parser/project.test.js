'use strict';

var expect = require('expect.js');
var parseProject = require('./project');

describe('project alias parser', function() {

  it('should ignore text without prefix', function () {
    var input = 'foo ba-r baz';
    var result = parseProject({ _text: input });
    expect(result).not.to.have.property('project');
    expect(result).to.have.property('_text');
    expect(result._text).to.eql(input);
  });

  it('should extract project alias', function () {
    var input = 'foo /ba-r baz';
    var result = parseProject({ _text: input });
    expect(result).to.have.property('project');
    expect(result.project).to.eql({alias: 'ba-r'});
    expect(result).to.have.property('_text');
    expect(result._text).to.eql('foo  baz');
  });

});
