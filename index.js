var fs = require('fs');

var hasFile = function() {
  return fs.existsSync(filePath);
};

var deleteFile = function(verbose) {
  try {
    return fs.unlinkSync(filePath);
  } catch (ex) {
    if (verbose){
      console.error('error deleting marker file.', ex, ex.stack);
    }
  }
};

var touchFile = function() {
  try {
  return fs.openSync(filePath, 'w');
  } catch (ex){
    if (verbose){
      console.error('error writing marker file.', ex, ex.stack);
    }
  }
};


var restartOmeter = function(options){
  if (!(this instanceof restartOmeter)) {
    return new restartOmeter(options);
  }
  options = options || {};
  this.secondsToBoot = options.secondsToBoot || 30;
  this.filePath = options.filePath || '/tmp/STARTED';
  this.onRestart = options.onRestart || function(){};
  this.verbose = true;
  if (options.verbose === false){
    this.verbose = false;
  } 
};

restartOmeter.prototype.masterStart = function(){
  var verbose = this.verbose;
  if (verbose){
    console.log("master start");
  }
  deleteFile(verbose);
  return setTimeout(function() {
    return touchFile(verbose);
  }, 1000 * this.secondsToBoot);
};

restartOmeter.prototype.childStart = function(){
  var verbose = this.verbose;
  if (hasFile()) {
    if (verbose) console.log("child restart");
    this.onRestart();
  } else {
    if (verbose) console.log("child start");
  }
};

module.exports = restartOmeter;



