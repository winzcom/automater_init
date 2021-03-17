#! /usr/local/bin/node

const Automater = require('./automate/main');

const automater = new Automater();

automater.setFlags('l', {
    long: 'list',
    func: (val) => {
        console.log('i am a logger ', val)
    }
})

automater.setFlags('f', {
    long: '----flag',
    func: (val) => {
        console.log('this is for flag ', val)
    }
})

automater.setFunc(function(flags, aflags) {
    //automater.runCommand('ls ./');
    console.log({ gsh: automater.getCommandLogs() })
})

automater.run();

