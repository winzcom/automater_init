# automater_init
##It a simple cli. No dependencies. Small size##

__You can set each flags with functions to run, if it required and a long name version__

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
    automater.runCommand('ls ./');
    automater.getCommandLogs().then(console.log)
})

automater.run();

