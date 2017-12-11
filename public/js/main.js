const socket = io('http://localhost:3000');

$(document).ready(function(){

    const arrSaveMess = [{ username:"", ctent:""}];
    $('.signintrue').hide();
    $('.loadingtext').hide();

    $('#logout').click(function(){
        socket.emit('client-logout')
        $('.formsignin').show();
        $('.signintrue').hide();
    });
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
                const checkCl = $(`.showmessage ${username}`).length;
                console.log(checkCl);
                if(checkCl === 0) $('.showmessage').append(`<div class="${username}"></div>`);
                ulAppend.append(`<li title="${socketId}" data-user="${username}"><img src="images/ava.jpg" alt=""><span id="${socketId}_li">${username}</span></li>`);
            }
        });
    });

    $( document ).on( "click", ".useronline span", function() {
        const idroom = $(this).attr('id');
        const name_us = $(this).html();
        const divUser = $('.prv_username').html('');
        const idRoom = $('#idRoom').val('');
        divUser.append(name_us);
        idRoom.val(idroom.replace("_li",""));
        //remove alert mess
        $(this).parent().removeClass('usercoom_msg');
        //show history message
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
        const { username , message, relayto } = dataMess;
        const checkUser = $('.prv_username').html();
        if(checkUser){
            $('.useronline li').each( function() {
                const usercoom = $(this).attr('data-user');
                if(usercoom === username && usercoom !== checkUser) $(this).addClass('usercoom_msg');
            });
            arrSaveMess.push({ username: username, ctent: `<p class="guest">${username} : ${message}</p>`});
        }else{
            $('.prv_username').html(username);
            $('.showmessage').append(`<p class="guest">${username} : ${message}</p>`);
        } 
        
        const idroom = $('#idRoom').val(relayto);
        const ctent_mess = $('.showmessage').html();
        const arrLenght = arrSaveMess.length;
        if(arrLenght < 2){
            arrSaveMess.push({ username: username, ctent: ctent_mess});
        }else{
            const checkFinduser = arrSaveMess.find(isUser);
            if(typeof checkFinduser !== 'undefined'){
                arrSaveMess.find(isUser).ctent = ctent_mess;
            }else{
                arrSaveMess.push({ username: username, ctent: ctent_mess});
            }
        }
       console.log(arrSaveMess);
        //return username in array
        function isUser(user) { 
            return user.username === username;
        }       
    });
    socket.on('rel-user', dataMess => {
        const { username , message } = dataMess;
       $('.showmessage').append(`<p class='ad'>${message}</p>`);
    });

    //loadding đang trả lời
    $('#txt_mess').focusin( () => {
        socket.emit('user-typing');
    });
    $('#txt_mess').focusout( () => {
        socket.emit('user-stop-typing');
    });
    socket.on('user-typing', username => {
        $('.loadingtext').show();
        $('.loadingtext span').html(`${username}`)
    });
    socket.on('user-stop-typing', () => {
        $('.loadingtext').hide();
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
