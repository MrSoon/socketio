const socket = io('http://localhost:3000');


$(document).ready(function(){
    
    $('.signintrue').hide();
    $('.formsignin').submit( (e) => {
        e.preventDefault();
        const username = $('input[name="username"]').val();
        socket.emit('client-send-username', username);
        $('input[name="username"]').val('');
    });

    socket.on('server-send-dk-thatbai', () => {
        alert('Ten dang ky da ton tai !');
    });
    socket.on('server-send-username-notnull', () => {
        alert('Ten khong duoc trong !');
    });
    socket.on('server-send-dk-thanhcong', username => {
        $('.formsignin').hide(2000);
        $('.signintrue').show(1000);
        $('.hiuser').text(username);
    });

    socket.on('server-send-list-user', users => {
        const ulAppend = $('.useronline');
        $('.num_user_ol').html(' ');
        const num_user_ol = users.length - 1;
        $('.num_user_ol').append(num_user_ol);
        ulAppend.html('');
        users.forEach(user => {
            const {username, socketId} = user;
            if(socket.id !== socketId){
                ulAppend.append(`<li><img src="images/ava.jpg" alt=""><span id="${socketId}">${username}</span></li>`);
            }
            
        });
        
    });

    $('#logout').click(function(){
        socket.emit('client-logout')
        $('.formsignin').show(500);
        $('.signintrue').hide(500);
    });

    //chat form
    $('.formchat').submit( e => {
        e.preventDefault();
        const message = $('input[name="message"]').val();
        const idroom = $('#idRoom').val();
        socket.emit('client-send-message-private', {idroom, message});
        $('input[name="message"]').val('');
    });
    socket.on('server-send-message-private', dataMess => {
        const { username , message, id } = dataMess;
        console.log(username);
        console.log(message);
        console.log(id);
        console.log(socket.id);

        if(socket.id === id){
            $('.showmessage').append(`<p class='ad'>${message} : ${username}</p>`);
        }else{
            $('.showmessage').append(`<p class="guest">${username} : ${message}</p>`);
        }
        //private auto chat
        if(id !== socket.id){
            $('.prv_username').html(username);
            $('#idRoom').val(id);
        }
        
    });

    $('#textmess').focusin( () => {
        socket.emit('toi-dang-go');
    });
    $('.loadingtext').hide();
    socket.on('server-send-co-nguoi-dang-go', username => {
        $('.loadingtext').show();
        $('.loadingtext span').html(`${username}`)
    });
    $('#txt_mess').focusin( () => {
        socket.emit('toi-dang-go');
    });
    $('#txt_mess').focusout( () => {
        socket.emit('toi-ngung-go');
    });
    socket.on('server-send-ngung-go', () => {
        $('.loadingtext').hide();
    });
    //tao room
    $('#btntaoroom').click(function(){
        socket.emit('tao-room', $('#txtRoom').val());
        $('#txtRoom').val('');
    });
    socket.on('server-send-list-room', arrRoom => {
        const roomhave = $('.roomhave').html('');
        $('.allroom').html('');
        $('.allroom').append(arrRoom.length);
        arrRoom.map( i => {
            roomhave.append(`<li class="room">${i.slice(5)}</li>`)
        });
    });
    socket.on('server-send-room-socket', room =>{
        $('#stayroom').html('');
        $('#stayroom').text(`${room}`)
    });
    $('#idchatroom').click(() => {
        socket.emit('user-chat-room', $('#txtchatroom').val());
    });
    socket.on('server-send-mess-chatroom', data => {
        $('.messchatroom').append(`<p>${data}</p>`)
    });

    //chat private user

    $( document ).on( "click", ".useronline span", function() {
        const showmessage = $('.showmessage');
        const idroom = $(this).attr('id');
        showmessage.attr('id', idroom);
        $('.showmessage#'+idroom).show();
        const name_us = $(this).html();
        const divUser = $('.prv_username').html('');
        const idRoom = $('#idRoom').html('');
        divUser.append(name_us);
        idRoom.val(idroom);

    });
    
});

function startTime() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    m = checkTime(m);
    s = checkTime(s);
    document.getElementById('datetime').innerHTML =
    h + ":" + m + ":" + s;
    var t = setTimeout(startTime, 500);
}
function checkTime(i) {
    if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
    return i;
}
