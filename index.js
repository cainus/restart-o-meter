var fs = require('fs');

var hasFile = function(filePath) {
  return fs.existsSync(filePath);
};

var deleteFile = function(filePath, verbose) {
  try {
    return fs.unlinkSync(filePath);
  } catch (ex) {
    if (/^ENOENT/.test(ex.message)){
      return;
    }
    if (verbose){
      console.error('error deleting marker file.', ex, ex.stack);
    }
  }
};

var touchFile = function(filePath, verbose) {
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
  var filePath = this.filePath;
  if (verbose){
    console.log("master start");
  }
  deleteFile(filePath, verbose);
  return setTimeout(function() {
    return touchFile(filePath, verbose);
  }, 1000 * this.secondsToBoot);
};

restartOmeter.prototype.childStart = function(){
  var verbose = this.verbose;
  if (hasFile(this.filePath)) {
    if (verbose) console.log("child restart");
    this.onRestart();
  } else {
    if (verbose) console.log("child start");
  }
};

module.exports = restartOmeter;



