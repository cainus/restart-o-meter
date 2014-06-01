restart-o-meter
============
[![Build
Status](https://secure.travis-ci.org/cainus/restart-o-meter.png?branch=master)](http://travis-ci.org/cainus/restart-o-meter)
[![Coverage Status](https://coveralls.io/repos/cainus/restart-o-meter/badge.png?branch=master)](https://coveralls.io/r/cainus/restart-o-meter)

Detect process "restarts" (as opposed to just "starts") in node.js processes in a cluster.  A 'start' is anytime a process in the cluster starts.  A 'restart' is anytime a process in the cluster restarts after the last master 'start'.  I use this with [cluster-master](https://github.com/isaacs/cluster-master), but it can probably be used with any clustering solution, including node.js's standard cluster module.  This module requires some minimal file i/o to maintain application state between server restarts, so you'll need read/write access to some path for this to work.


## Basic set-up:

```javascript
var restartOMeter = require('restart-o-meter')({
  secondsToBoot : 20,
  filePath : '/tmp/STARTED',
  onRestart : function(){
    console.log("detected a restart!");
  }
  verbose : true
});

```

### secondsToBoot
This is your way of indicating how long the application should take to
start, in seconds.  During this time, no 'starts' will be counted as
'restarts'.  After this time, all 'starts' will be counted as 'restarts'
until `masterStart()` is called again.  This is not a required property,
as it will default to `30` seconds.  You want this to be long enough
that regular process boot-time isn't longer than the duration causing
false restart detections, but also short enough that if a process gets
stuck in a restart loop, you can detect it as fast as possible. 

### filePath
This is the path to the temporary file that is used to denote that the
process has been started.  It exists despite reboots so that the
restart-o-meter can tell if a 'start' is actually a 'restart'.  This is
not a required property as it will default to `/tmp/STARTED`.  NB: If the
filepath that you use is not writable by the user that your process runs
as, then this will not work.

### onRestart
This is a callback that gets called when a restart is detected.  You
can put logging or metrics in this.  It's not a required option, but
it's really the whole point of this module.

### verbose
Enable verbose logging to standard out.

## Usage:
Call `masterStart()` at the earliest point in your code possible. eg:

```javascript
restartOMeter.masterStart();
```

Call `childStart()` at the earliest point in your child process code,
possible.  eg:
 

```javascript
restartOMeter.childStart();
```


