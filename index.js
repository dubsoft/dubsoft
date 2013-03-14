var tako = require('tako'),
  app = tako(),
  path = require('path'),
  fs = require('fs'),
  cluster = require('cluster')
  numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  var i = 0;
  for (; i < numCPUs; i++){
    cluster.fork();
  }

  cluster.on('exit', function(worker, code, signal){
    console.log('worker ' + worker.process.pid + ' died');
  });
} else {
  app.route('/static/*').files(path.join(__dirname, 'static'));

  app.route('/')
    .html(function(req, resp){
      fs.readFile(path.join(__dirname, 'html/index.html'), function(err, data){
        resp.end(data.toString());
      });
    })
    .methods('GET')
    ;

  app.httpServer.listen(process.env.PORT || 3000);
}
