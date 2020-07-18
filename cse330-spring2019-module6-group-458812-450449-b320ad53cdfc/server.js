var http = require("http"),
	socketio = require("socket.io"),
	fs = require("fs");

// Listen for HTTP connections.  This is essentially a miniature static file server that only serves our one file, client.html:
var app = http.createServer(function(req, resp){
	// This callback runs when a new connection is made to our HTTP server.
	
	fs.readFile("client.html", function(err, data){
		// This callback runs when the client.html file has been read from the filesystem.
		
		if(err) return resp.writeHead(500);
		resp.writeHead(200);
		resp.end(data);
	});
});
app.listen(3456);

var io = socketio.listen(app);
let home={name:"home", admin:null, ban:false, password:null,users:[]};
let roomlist = [];
var total_user_onsite=[];
roomlist.push(home);

io.sockets.on("connection", function(socket){
	// This callback runs when a new Socket.IO connection is established.
	
    socket.on("add_new_log_user",function(data){
        let bool =true;
        for(i in total_user_onsite){
            if(data == total_user_onsite[i]){
                bool=false;
            }
        }
        if(bool){
        total_user_onsite.push(data);
        socket.join("home");
        socket.emit("valid_user",data);
    }
        else{
            socket.emit("repeat_user","Repeat username! Try another.");
        }
        
    });
    socket.on("kick_to_sever", function(data){
        let user = data['user'];
        io.sockets.in(data['room']).emit("you_need_leave_room",user);
    });
    socket.on('message_to_server', function(data) {
        let to=data['to'];
        //console.log("to: "+to);
        if(to!=null&&to!=""){
        let room=data['room'];
        let userlist = null;
        let nouser = true;
        for(i in roomlist){
            if(room==roomlist[i]['name']){
                userlist=roomlist[i]['users'];
                break;
            }
        }
        for(i in userlist){
            if(userlist[i]==to){
                nouser=false;
                io.sockets.in(data['room']).emit("message_to_client",{message:data["message"], user:data["user"], room:data["room"],to:data['to']}) // broadcast the message to other users
                break;
            }
        }
        if(nouser){
            socket.emit("to_fail",{to:to});
        }}
        else{
            io.sockets.in(data['room']).emit("message_to_client",{message:data["message"], user:data["user"], room:data["room"],to:data['to']}) // broadcast the message to other users
        }
		// This callback runs when the server receives a new message from the client.
		
		//console.log("message: "+data["message"]); // log it to the Node.JS output
    });
    socket.on("createNew_to_sever", function(data){
        let userlist=[];
        if(data['room'].indexOf(' ')!=-1){
            return socket.emit("repeat_table","Invalid Room! No space!");
        }
        
        let room={name:data['room'], admin:data['admin'], ban:false, password:data['password'],users:userlist};
        //console.log(room)
        
        for(i in roomlist){
            if(roomlist[i]['name']==data['room']){
                //console("roomlist",roomlist[i]);
                return socket.emit("repeat_table","Room has already exist!");
            }
        }
        roomlist.push(room);
        io.sockets.emit("createNew_to_client",roomlist);
    });
    socket.on("request_room_list", function(data){
        io.sockets.emit("createNew_to_client", roomlist);
    });
    
    socket.on("add_new_user_to_client", function(data){
        let user = data['user'];
        let room = data['room'];
        let userlist = null;
        for(i in roomlist){
            if(roomlist[i]['name']==room){
                userlist = roomlist[i]['users'];
                break;
            }
        }
        socket.join(room);
        userlist.push(user);
    });
    socket.on("request_user_list", function(data){
        
        let room = data['room'];
        let userlist = null;
        for(i in roomlist){
            if(roomlist[i]['name']==room){
                userlist = roomlist[i]['users'];
                break;
            }
        }
        if(data['invite']==null){
            socket.emit("post_user_list", userlist);
        }else{
            socket.emit("post_user_list2", userlist);
        }
        
    });
    
    socket.on("changeRoom_to_sever",function(data){
        let user = data['user'];
        let new_userlist=[];
        let old_userlist=[];
        let room=null;
        let hasPass = false;
        let pass=null;
        let ban = false;
        for(i in roomlist){
            if(roomlist[i]['name']==data['to_room']){
                ban = roomlist[i]['ban'];
                if(roomlist[i]['password']!=null&&roomlist[i]['password']!=""){
                    hasPass=true;
                    pass=roomlist['password'];
                }
                break;
            }
        }
        if(!ban){
           if(!hasPass){
           let admin=null;
            for(i in roomlist){
            if(roomlist[i]['name']==data['to_room']){
                roomlist[i]['users'].push(user);
                room=roomlist[i]['name'];
                admin=roomlist[i]['admin'];
            }
        
            if(roomlist[i]['name']==data['leave_room']){
                for(j in roomlist[i]['users']){
                   
                    if(roomlist[i]['users'][j]==user){
                        roomlist[i]['users'].splice(j,1);
                    }
                }
            }
        }
        
        socket.leave(data['leave_room']);
        socket.join(room);
        socket.emit("changeRoom_to_client", {room:room,admin:admin});
    }else{
        socket.emit("require_pass_to_client",{});
    }
}
else{
    socket.emit("ban_cannot_join","The admin locked the room!");
}
    });
    socket.on("changeRoom_pass_to_sever",function(data){
        let user = data['user'];
        let room=null;
        let pass=data['pass'];
        //console.log(pass);
        let check = false;
        for(i in roomlist){
            if(roomlist[i]['name']==data['to_room']){
                if(pass == roomlist[i]['password']){
                    check =true;
                    //console.log(roomlist[i]['password']);
                }
                break;
            }
        }
        //console.log(check);
        if(check){
            admin=roomlist[i]['admin'];
            for(i in roomlist){
            if(roomlist[i]['name']==data['to_room']){
                
                roomlist[i]['users'].push(user);
                room=roomlist[i]['name'];
                
            }
        
            if(roomlist[i]['name']==data['leave_room']){
                for(j in roomlist[i]['users']){
                   
                    if(roomlist[i]['users'][j]==user){
                        roomlist[i]['users'].splice(j,1);
                    }
                }
            }
        }
        socket.leave(data['leave_room']);
        socket.join(room);
        socket.emit("changeRoom_to_client", {room:room, admin:admin});
    }else{
        socket.emit("wrong_pass",{});
    }
    
    });
    socket.on("update_all", function(data){
        io.sockets.emit("update_all",{});
    });
    socket.on("room_close",function(data){
        for(i in roomlist){
            if(roomlist[i]['name']==data['room']){
                roomlist[i]['ban']=data['ban'];
                break;
            }
        }
        if(data['ban']){
        socket.emit("success_ban","The room has been locked!");
    }else{
        socket.emit("success_ban","The room has been opened!");
    }

    });
    socket.on("leave_the_page",function(data){
        for(i in roomlist){
            if(roomlist[i]['name']==data['room']){
                for(j in roomlist[i]['users']){
                    if(roomlist[i]['users'][j]==data['user']){
                        roomlist[i]['users'].splice(j,1);
                    }
                }
            }
        }
        for(i in total_user_onsite){
            if(total_user_onsite[i]==data['user']){
                total_user_onsite.splice(i,1);
            }
        }
        
        io.sockets.emit("update_all",{});
    });
    socket.on("send_invitation_to_sever",function(data){
        console.log("the user is "+data['user']);
        let bool = true;
        for(i in roomlist){
            
            if(roomlist[i]['name']==data['room']){
                
                
                if(roomlist[i]['password']!=null&&roomlist[i]['password']!=""){
                    console.log("roomlist pass"+roomlist[i]['password']=="");
                    console.log("roomlist pass"+roomlist[i]['password']==null);
                    console.log("roomlist pass"+roomlist[i]['password']);
                    bool =false;
                    socket.emit("repeat_table","Can't invite people to private room.");
                }
            }
        }
        if(bool){
        io.sockets.in("home").emit("send_invitaion_to_client",{user:data['user'],room:data['room'], host:data['host']});}
    })
});