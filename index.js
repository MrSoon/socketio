const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const User = require('./User');
const { sign, verify } = require('./jwt');


app.set('view engine','ejs');
app.set('views','./views');
app.use(express.static('public'));

app.get('/',(req, res) => {
    res.render('home');
});
app.get('/demo',(req, res) => {
    res.render('demo');
});
const users = [];

io.on('connection', socket => {

    socket.on('client-send-username', username => {
        username_check = users.map(function(e) { return e.username; }).indexOf(username);
        if(username_check === 0){
            //that bai
            socket.emit('server-send-dk-thatbai');
        }else{
            if(username === '') return socket.emit('server-send-username-notnull');
            const user = ({username: username, socketId: socket.id});
            users.push(user);
            socket.username = username;
            socket.emit('server-send-dk-thanhcong', username);
            io.emit('server-send-list-user', users);
        }
        
    });

    //private chat user
    socket.on('client-send-message-private', data => {
        const dataMess = {username : socket.username, message : data.message, relayto: socket.id};
        socket.broadcast.to(data.idroom).emit('server-send-message-private', dataMess);
        socket.emit('rel-user', dataMess);
    });
    //check user typing
    socket.on('user-typing', () => {
        socket.broadcast.emit('user-typing', socket.username);        
    });
    socket.on('user-stop-typing', () => {
        socket.broadcast.emit('user-stop-typing');        
    });


});
// io.on('connection', socket => {
    
//     socket.on('client-send-username', username => {
//         username_check = users.map(function(e) { return e.username; }).indexOf(username);
//         if(username_check === 0){
//             //that bai
//             socket.emit('server-send-dk-thatbai');
//         }else{
//             if(username === '') return socket.emit('server-send-username-notnull');
//             const user = ({username: username, socketId: socket.id});
//             users.push(user);
//             socket.username = username;
//             socket.emit('server-send-dk-thanhcong', username);
//             io.emit('server-send-list-user', users);
//             io.emit('server-send-list-room', arrayRoom());
//         }
        
//     });

//     socket.on('client-logout', () =>{
//         users.splice(
//             users.indexOf(socket.username),1
//         );
//         socket.broadcast.emit('server-send-list-user', users);
//         socket.broadcast.emit('server-send-ngung-go');
//     });

//     socket.on('change-room-user', data => {
//         console.log(data.idrooms);
//         console.log(data.inroom);
//         console.log(socket.phong);

//         if(socket.phong) socket.leave(socket.phong);
//         const room = data.idrooms;
//         socket.join(room);
//         socket.phong = `${room}vs${data.inroom}`;

//         console.log('====socket.phong====');
//         console.log(socket.phong);
//         console.log('====socket.adapter.rooms====');
//         console.log(socket.adapter.rooms);
        
        
        
        
//     });

//     socket.on('client-send-message-private', data => {
//         // const room = data.idroom;
//         // socket.join(room);
//         // socket.phong = room;
        
//         console.log('========');
//         console.log(socket.adapter.rooms);
//         const dataMess = {username : socket.username, message : data.message, socketPhong : socket.phong};
//         //socket.broadcast.to
//         socket.broadcast.to(data.idroom).emit('server-send-message-private', dataMess);
//         socket.emit('rel-user', dataMess);
//     });

//     socket.on('toi-dang-go', () => {
//         socket.broadcast.emit('server-send-co-nguoi-dang-go', socket.username);        
//     });
//     socket.on('toi-ngung-go', () => {
//         socket.broadcast.emit('server-send-ngung-go');        
//     });

//     //socket.adapter.rooms show danh sach room dang co
//     socket.on('tao-room', room => {
//         const nameRoom = `room_${room}`
//         socket.join(nameRoom);
//         socket.phong = nameRoom;
//         io.emit('server-send-list-room', arrayRoom());
//         socket.emit('server-send-room-socket', room);
        
//         console.log("===rom===");
//         console.log(socket.adapter.rooms);
//         console.log("======");
//         arrayRoomuser();
        
//     });
//     socket.on('user-chat-room', data => {
//         io.sockets.in(socket.phong).emit('server-send-mess-chatroom', data);
//     });

    

//     function arrayRoom(){
//         const arrRoom = [];
//         for(i in socket.adapter.rooms){
//             let checkRoom = i.indexOf('room_');
//             if(i.indexOf('room_') === 0 )  arrRoom.push(i);
//         };
//         return  arrRoom;
//     };
//     function arrayRoomuser(){
//         const arrRoomuser = [];
//         for(i in socket.adapter.rooms){
//             console.log(i);
//         };
//        // return  arrRoomuser;
//     };
    
// });





server.listen(3000, () => {
    console.log('Server Start !');
})