const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const ejs = require('ejs');
const session = require('express-session');
const {userJoin, userLeave, getRoomUser} = require('./utils/users')


app.use(session({
    secret:'secret',
    resave:true,
    saveUninitialized:true
}))
app.use(express.static('assets'));
app.use(express.urlencoded({ extended: true }));



app.get('/', (req, res) => {
    ejs.renderFile('views/index.ejs', (err, data) => {
        res.send(data);
    })
})

app.post('/chat', (req, res) => {

    let user = {
        nickname: req.body.nickname,
        roomname: req.body.roomname
    }

    if (user.nickname == '' || user.roomname == '') {
        res.redirect('/');
    } else {
        session.userName = user.nickname;
        session.userRoom = user.roomname;
        req.session.userName = user.nickname;
        req.session.rooomName = user.roomname;
        ejs.renderFile('views/chat.ejs', { user }, (err, data) => {
            if (err) throw err;
            res.send(data);
        })
    }
})

io.on('connection', (socket) => {
    socket.on('joinRoom', ()=>{
        let user = {
            name:session.userName,
            room:session.userRoom
        };
        userJoin(socket.id, user.name, user.room);
        socket.join(user.room);
        socket.broadcast.to(session.userRoom).emit('roomUsers', getRoomUser(session.userRoom));
        socket.emit('roomUsers', getRoomUser(session.userRoom));
        socket.emit('message', 'Rendszerüzenet', `Üdvözlünk a ${user.room} csatornán!`)
        socket.broadcast.to(user.room).emit('message', 'Rendszerüzenet', `${user.name} csatlakozott a szobához!`);
    })
    socket.on('isTyping', (user)=>{
        socket.emit('showType', user);
        socket.broadcast.to(session.userRoom).emit('showType', user);
    })
    socket.on('isTypingnt', (user)=>{
        socket.emit('showTypent', user);
        socket.broadcast.to(session.userRoom).emit('showTypent', user);
    })
    socket.on('disconnect', () => {
        userLeave(socket.id)
        socket.to(session.userRoom).emit('roomUsers', getRoomUser(session.userRoom));
        socket.to(session.userRoom).emit("message", 'Rendszerüzenet', `${session.userName} lelépett.`)
    });
    socket.on('send', (usr, msg)=>{
        socket.to(session.userRoom).emit("message", usr, msg)
        socket.emit('message', usr, msg);
    })
});
server.listen(3000);