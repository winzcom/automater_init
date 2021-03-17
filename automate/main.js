#! /usr/local/bin/node

const { exec } = require('child_process');

class Automate {
    constructor() {
        if(Automate.instance) {
            return Automate.instance;
        }
        this.username;
        this.password;
        this.sdi
        this.flags = {}
        this.command_running = false;
        this.flagset = {}
        this.aflags = []
        this.command_logs = ''
        this.command_done = false;
        this.lsStdin
        this.lsStdout
        this.curStdin
        this.func;
        this.sdo = process.stdout;
        Automate.instance = this
        return Automate.instance;
    }
    
    setFlags(val, options = {}) {
        //console.log({ klk: options })
        this.flags[val] = { ...options }
        if(options.long) {
            let long = '-' + options.long.replace(/_|-/g, '')
            delete options.long;
            this.flags[long] = {...options, short: val }
        }
    }

    getFlags() {
        return this.flags
    }

    readFlags() {
        let args = process.argv;
        args = args.slice(2)
        if(args.length > 0) {
            for(let i = 0; i < args.length; i += 1) {
                let flag = args[i];
                flag = flag.replace(/-{1}/,'');
                if(this.flags[flag]) {
                    let next = i + 1;
                    if(next < args.length) {
                        let pool = args[next].replace(/-{1}/,'')
                        if(!this.flags[pool]) {
                            this.flagset[flag] = args[++i];
                        }
                    } else if(!this.flagset[flag]) { this.flagset[flag] = true }
                    if(this.flags[flag].long && this.flagset[this.flags[flag].long]) {
                        delete this.flagset[this.flags[flag].long];
                    } else if(this.flags[flag].short) {
                        if(!this.flagset[this.flags[flag].short]) {
                            this.flagset[this.flags[flag].short] = this.flagset[flag];
                        }
                        delete this.flagset[flag];
                    }
                    let flagger = this.flags[flag].short || flag;
                    if(this.flags[flagger].func && typeof this.flags[flagger].func == 'function') {
                        this.flags[flagger].func(this.flagset[flagger]);
                    }
                } else {
                    this.aflags.push(flag)
                }
            }
        }
    }

    setFunc(func) {
        this.func = func
    }

    run() {
        this.readFlags();
        this.func(this.flagset, this.aflags);
    }

    runCommand(command) {
        this.command_running = true;
        const ls = exec(command);
        this.lsStdin = ls.stdin;
        this.lsStdout = ls.stdout;
        this.curStdin = process.stdin;

        this.setUpListenerOnCli();
    }

    setUpListenerOnCli() {
        this.lsStdout.on('data', (data) => {
            this.command_logs += data;
            this.curStdin.write(data);
            this.curStdin.resume();
        })

        this.curStdin.on('data', (data) => {
            this.lsStdin.write(data);
        })

        this.lsStdout.on('end', () => {
            this.command_running = false;
            this.curStdin.pause();
            this.curStdin.end();
            this.command_done = true;
        })
    }

    setCommandLogs() {
        if(!this.command_running) {
            return Promise.resolve('no commands running');
        }
        return new Promise((res, rej) => {
            let timeout = setInterval(() => {
                if(this.command_done) {
                    clearInterval(timeout)
                    res(this.command_logs);
                }
            }, 100);
        })
    }

    getCommandLogs() {
        if(!this.command_running) {
            return Promise.resolve('no commands running');
        }
        console.log('no commands')
        return this.setCommandLogs()
    }
}

module.exports = Automate;