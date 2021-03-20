#! /usr/local/bin/node

const Automater = require('./automate/main');

const automater = new Automater({
    flags: {
        r: {
            long: 'rainbow',
            func: (val) => {
                console.log('what is rainbow ', val)
            }
        }
    }
});

automater.setFlags('l', {
    long: 'list',
    required: true, 
    func: (val) => {
        console.log('i am a logger ', val)
    }
})

automater.setFlags('f', {
    func: function(val) {
        console.log('f value ', val)
    },
    required: true,
})
automater.setHelpLog(`
Usage
  $ foo <input>

Options
  --rainbow, -r  Include a rainbow

Examples
  $ foo unicorns --rainbow
  🌈 unicorns 🌈
`);

automater.setFunc(function(flags, aflags) {
    //automater.runCommand(`echo ${flags} ${aflags}`);
})

automater.run();

