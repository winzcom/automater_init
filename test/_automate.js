const { expect } = require('chai');
const { describe, it } = require('mocha')

const ECli = require('../automate/main');

const auto = new ECli();



describe('Check automate working', function() {
    it('it should throw an error', () => {
        auto.runCommand('./main -h')
    })
})