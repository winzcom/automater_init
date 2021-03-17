const { expect } = require('chai');
const { describe, it } = require('mocha')
const fs = require('fs')

const { execSync, exec } = require('child_process');

// automate.setFlags('n');
// automate.setFlags('p');
// automate.setFunc(function(flags) {
//     console.log({ flags })
// })

describe('Check automate working', function() {
    it('Flag should be set', function (done) {
        this.timeout(0)
        let ls = exec('npm init');
        let count = 0;
        let pstd = process.stdin;
        ls.stdout.on('end', () => {
            pstd.pause();
            ptsd.end();
            const package_json = JSON.parse(Buffer.from(fs.readFileSync('./package.json')).toString())
            if(!package_json || package_json.name != 'automate') {
                done(new Error('failed to create package file'))
            } else {
                done()
            }
        })
        pstd.on('data', (data) => {
            ls.stdin.write(data);
        })
        ls.stdout.on('data', (data) => {
            if(count !== 0) {
                pstd.write(data)
                pstd.resume()
            }
            ++count
        })
    })
})