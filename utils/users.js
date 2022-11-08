const users = [];

// room join
function userJoin(id,uname,rname){
    users.push({
        id:id,
        name:uname,
        room:rname
    });
    console.log(users.map(e=>e.name));
    console.log(users.map(e=>e.room));
}

// room disconnect
function userLeave(id){
    if (users.findIndex(e=>e.id==id)!=-1){
        users.splice(users.findIndex(e=>e.id==id), 1);
        console.log(users.map(e=>e.name))
    }
}

// get current user
function getCurrentUser(who){
    return users.findIndex(e=>e.name==who)==-1?"":users[users.findIndex(e=>e.name==who)].name;
}

// get room's users
function getRoomUser(room){
    return users.filter(e=>e.room==room).map(z=>z.name)
}


module.exports = {
    userJoin, userLeave, getCurrentUser, getRoomUser
}