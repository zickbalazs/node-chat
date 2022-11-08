var socket = io();
let user = document.querySelector('.nick').innerText;

socket.emit('joinRoom',()=>{
});
socket.on('showType', (usr)=>{
    GetWhoIsTyping(usr);
})
socket.on('showTypent', (usr)=>{
    GetWhoIsTypingnt(usr);
})


function GetWhoIsTyping(who){
    let usersNodes = document.querySelector('.userList').childNodes;
    usersNodes.forEach(e=>{
        if (e.innerText.trim()==who) e.querySelectorAll('i')[1].classList.remove('hide');
    })
}
function GetWhoIsTypingnt(who){
    let usersNodes = document.querySelector('.userList').childNodes;
    usersNodes.forEach(e=>{
        if (e.innerText.trim()==who) e.querySelectorAll('i')[1].classList.add('hide');
    })
}


socket.on('message', (usr, msg)=>{
    newMessage(usr, msg);
})
socket.on('roomUsers', (users)=>{
    listUsers(users);
})
document.querySelector('#send').addEventListener('click', ()=>{
    socket.emit('send', user, document.querySelector('#message').value);
    document.querySelector('#message').value="";
})
document.querySelector('#message').addEventListener('keydown', ()=>{
    socket.emit('isTyping', user);
})
document.querySelector('#message').addEventListener('keyup', ()=>{
    socket.emit('isTypingnt', user);
})




function listUsers(users){
    let userList = document.querySelector('.userList');
    userList.innerHTML="";
    users.forEach(element => {
        let li = document.createElement('li');
        li.innerHTML='<i class="bi bi-person-fill"></i> ' + element + ' <i class="bi bi-chat-dots hide"></i>'
        userList.append(li);
    });
}

function newMessage(usr, msg){
    let div = document.createElement('div');
    div.classList.add('message');
    let sender = document.createElement('p');
    let message = document.createElement('p');
    let timestamp = document.createElement('span');
    let triangle = document.createElement('div');
    triangle.classList.add('triangel')
    timestamp.innerText = new Date().toLocaleString('hu-HU').split(' ')[3];
    sender.innerText = usr;
    message.innerText = msg;
    sender.classList.add('sender')
    message.classList.add('msg');
    timestamp.classList.add('time')
    div.appendChild(sender);
    div.appendChild(message);
    div.appendChild(timestamp);
    div.appendChild(triangle);
    document.querySelector('.chat-interface').append(div);
}