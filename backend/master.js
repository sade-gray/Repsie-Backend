'use strict';
var cluster = require('cluster');
// Ask the number of CPU-s for optimal forking (one fork per CPU)
var numCPUs = require('os').cpus().length;
cluster.setupMaster({
exec : __dirname + '/cloud.firestore/firestoreNodeJS.js' // Points to the index file you want to fork
})

for (var i = 0; i < numCPUs; i++) {
cluster.fork();
}
cluster.on('disconnect', function(worker) {
console.log("Forked!")
console.error('disconnect!'); // This can probably use some work.
cluster.fork();
})

const clusterFunction = () => {
    return cluster;
  };

module.exports =  clusterFunction