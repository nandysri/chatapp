var mongoose = require('mongoose');
var express = require('express'), app = express(), server = require('http').createServer(app);
var jade = require('jade');
var io = require('socket.io').listen(server);

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set("view options", { layout: false });
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.render('home.jade');
});
server.listen(3000);


io.sockets.on('connection', function (socket) {
   
socket.on('setPseudo', function (data) {
   socket.set('pseudo', data);
});

socket.on('message', function (message) {
    socket.get('pseudo', function (error, name) {
        var data = { 'message' : message, pseudo : name };
        var newMsg = new Chat({user: '' + name, msg: '' + message}); 
        console.log('saving newMsg: ' + newMsg);
        newMsg.save(function(err){
            console.log('saved, err = ' + err);
            if(err) throw err;
            socket.broadcast.emit('message', data);
            console.log("user " + name + " send this : " + message);
        }); 
    })
});


});

var chatSchema = mongoose.Schema({
    user: String,
    msg: String,
    created: {type: Date, default: Date.now}
});

var Chat = mongoose.model('Message', chatSchema);



mongoose.connect('mongodb://localhost/chat', function(err){
if(err){
console.log(err);
} else{
    console.log('Connected to mongodb!');
}
});