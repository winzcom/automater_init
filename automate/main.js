#! /usr/local/bin/node

const { exec } = require('child_process');

class Automate {
    constructor(options) {
        if(Automate.instance) {
            return Automate.instance;
        }
        this.username;
        this.password;
        this.sdi
        this.flags = options ? options.flags : {}
        this.command_running = false;
        this.flagset = {}
        this.aflags = []
        this.flaggers = []
        this.command_logs = ''
        this.command_done = false;
        this.lsStdin
        this.lsStdout
        this.curStdin
        this.func;
        this.sdo = process.stdout;
        Automate.instance = this

        let op = Object.keys(this.flags);
        for(let i = 0; i < op.length; i +=1) {
            if(this.flags[op[i]].long) {
                let long = '-' + this.flags[op[i]].long.replace(/_|-/g, '')
                this.flags[long] = { ...this.flags[op[i]], short: op[i], long: undefined }
            }
        }
        return Automate.instance;
    }
    
    setFlags(val, options = {}) {
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
                    }
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
                        this.flaggers.push(flagger)
                        
                    }
                } else {
                    this.aflags.push(flag)
                }
               if(this.flags[flag] && !this.flagset[flag] ) {
                   if(this.flags[flag].required)
                        throw new Error(`Flag ${flag} is required`);
                    else this.flagset[flag] = {}
               } 
            }
            this.runFlaggers();
        }
    }

    setFunc(func) {
        this.func = func
    }

    run() {
        this.readFlags();
        if(this.flagset.h) {
            return
        }
        console.log({ the: this.flagset })
        this.func(this.flagset, this.aflags);
    }

    runCommand(command) {
        if(this.flagset.h) {
            return
        } 
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

    runFlaggers() {
        if(this.flagset.h) {
            return this.flags.h.func.apply(null)
        }
        for(let i = 0; i < this.flaggers.length; i += 1) {
            this.flags[this.flaggers[i]].func.apply(null, [this.flagset[this.flaggers[i]]]);
        }
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

    setHelpLog = (func) => {
        let type = typeof func;
        if(type == 'string') {
            this.setFlags('h', {
                long: 'help',
                func: () => console.log(func)
            })
        } else if(type == 'function') {
            this.setFlags('h', {
                long: 'help',
                func,
            })
        }
    }

    setFlagValue = (flag, val) => {
        if(!this.flags[flag]) {
            throw new Error(`Flag ${flag} is not set`);
        }
        this.flagset[flag] = val;
    }
}

module.exports = Automate;