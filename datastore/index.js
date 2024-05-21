const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    if (err) {
      callback(err);
    } else {
      fs.writeFile(path.join(exports.dataDir, id), text, (err) => {
        if (err) {
          callback(err);
        } else {
          callback(null, {id, text});
        }
      });
    }
  });
};

exports.readAll = (callback) => {
  var readDirPromise = new Promise((resolve, reject) => {
    fs.readdir(exports.dataDir, (err, fileNames) => {
      if (err) {
        callback (err);
      } else {
        resolve(fileNames);
      }
    });
  });
  readDirPromise.then(fileNames => Promise.all(fileNames.map(fileName => new Promise((resolve, reject) => {
    fs.readFile(path.join(exports.dataDir, fileName), 'utf8', (err, text) => {
      if (err) {
        callback(err);
      } else {
        resolve({id: fileName, text});
      }
    });
  }))
  ))
    .then(todos => callback(null, todos));
};

exports.readOne = (id, callback) => {
  fs.readFile(path.join(exports.dataDir, id), 'utf8', (err, fileData) => {
    if (err) {
      callback(err);
    } else {
      callback(null, {id, text: fileData});
    }
  });
};

exports.update = (id, text, callback) => {
  fs.writeFile(path.join(exports.dataDir, id), text, (err) => {
    if (err) {
      callback(err);
    } else {
      callback(null, {id, text});
    }
  });
};

exports.delete = (id, callback) => {
  fs.rm(path.join(exports.dataDir, id), (err) => {
    if (err) {
      callback(err);
    } else {
      callback(null);
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
