let token=null;
//deal with the data updating

// For our purposes, we can keep the current month in a variable in the global scope
let currentMonth = new Month(2017, 9); // October 2017


const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];//the arrayList of month name

// Change the month when the "next" button is pressed
document.getElementById("next_month_btn").addEventListener("click", function(event){
    currentMonth = currentMonth.nextMonth(); // Previous month would be currentMonth.prevMonth()
    updateCalendar(); // Whenever the month is updated, we'll need to re-render the calendar in HTML
    uploadEvent();// upload events

	
}, false);
document.getElementById("prev_month_btn").addEventListener("click", function(event){
	currentMonth = currentMonth.prevMonth(); // Previous month would be currentMonth.prevMonth()
	updateCalendar(); // Whenever the month is updated, we'll need to re-render the calendar in HTML
	uploadEvent();
}, false);


let node=document.getElementById("calendar").getElementsByClassName("days");
let point = node[0].getElementsByClassName("day");
document.addEventListener("load",updateCalendar(),false);


// This updateCalendar() function only alerts the dates in the currently specified month.  You need to write
// it to modify the DOM (optionally using jQuery) to display the days and weeks in the current month.
function updateCalendar(){
    for(var i =0; i<42;i++){
        point[i].textContent=null;
    }
    let weeks = currentMonth.getWeeks();
    //update the header
    document.getElementById("header_month").innerHTML= month[currentMonth.month]+"<br><span style='font-size:18px'>"+currentMonth.year+"</span>";
    
    let dataId = 0;
    for(let w in weeks){
        let days = weeks[w].getDates();	
        //alert(days[0].toString())
        
		for(let d in days){
           //alert(days[d].toString())
            point[dataId].textContent = days[d].toString().split(" ")[2];
            dataId=dataId+1;
		}
	}
}
function showdialog3(){
            $("#event").dialog();
}
document.getElementById("add-btn").addEventListener("click",showdialog3,false);

function addnewEvent(){
    let time = document.getElementById("time").value;
    let year = document.getElementById("year").value;
    let month2 = document.getElementById("month2").value;
    let day = document.getElementById("day").value;
    let desc = document.getElementById("desc").value;
    let tag="a";
    
    if (document.getElementById("groupb").checked){
        tag="b"
    }else{
        tag="a";
    }
    const data = {'year':year,'month2':month2,'day':day,'time':time,'desc':desc,'tag':tag,'token':token};
    $("#event").dialog('close');
    fetch('addevent.php',{
        method:'POST',
        body:JSON.stringify(data),
        headers:{'content-type': 'application/json'}
    })
    .then(response => response.json())
    .then(data =>{
        if(data.success){
            alert("add success");
        }else{
            alert(data.message);
        }
    }).then(updateCalendar()).then(uploadEvent())
    
}

document.getElementById("add").addEventListener("click",addnewEvent,false);

function uploadEvent(){
    const y=currentMonth.year;
    //alert(currentMonth.month);
    const m=currentMonth.month+1;
    const data ={'year':y,'month':m}
    fetch('uploadevent.php',{
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'content-type': 'application/json' }
    }).then(response => response.json())
    .then(data => {
        //add elemet to the calendar
        for(let i=0;i<42;i++){
          //alert(data.events.length)  
        for(let j=0;j< (data.events.length);j++){
            // alert(data.events.length)
            let e = (data.events[j]);
            if(i<7){
                
                let num = parseInt(point[i].textContent.substring(0,2));
                let dataday=parseInt(e['day']);
                if(num<10&&num==dataday){
                    inCal(i,e);
                }
            }else{
                if(i>27){
                    let num = parseInt(point[i].textContent.substring(0,2));
                    let dataday=parseInt(e['day']);
                if(num>10&&num==dataday){
                    inCal(i,e);
                }
                }else{
                   //7-27
                   let num = parseInt(point[i].textContent.substring(0,2));
                   let dataday=parseInt(e['day']);
                   if(num==dataday){
                       inCal(i,e);
                   }

                }
            }
        }
    }
    //alert(data.message)
    });
}
let a = document.getElementById("calendar").getElementsByClassName("day");
function inCal(pos,e){
    let conda = document.getElementById("show-a").checked; 
    let condb = document.getElementById("show-b").checked;
    //console.log(conda) ;
    if(!conda && e['tag']=="a"){
        return;
    }
    if(!condb && e['tag']=="b"){
        return;
    }
    
    let text= e['time']+" "+e["desc"];
    let enode= document.createElement("div");
    enode.textContent=text;
    a[pos].append(enode);
    enode.addEventListener("click", function(){
        const eid =e['eid'];
        data={'eid':eid,'token':token};
        fetch('delete.php',{
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
        })
        .then(response => response.json())
        .then(data => console.log("deleted")).then(enode.textContent=null)
    },false)
}
document.getElementById("logout-btn").addEventListener("click", function(event){
    let xmlHttp = new XMLHttpRequest();
    fetch("logout.php", {
        method:'POST',
        body:JSON.stringify(),
        headers:{'content-type':'application/json'}
    })
    .then(response => response.json())
    .then(data => {
        if(data.success){
            $("#login-btn").show();
            $("#logout-btn").hide();
            $("#signup-btn").show();
            $("#add-btn").hide();
            alert("Sign out Successfully!");
        }else{
        alert( 'Signout failed+${data.message}' );}
    }).then(updateCalendar()).then(uploadEvent())
},false);

document.getElementById("show-a").addEventListener("change",function(){
    updateCalendar();
    uploadEvent();},false);
document.getElementById("show-b").addEventListener("change",function(){
    updateCalendar();
    uploadEvent();},false);

// share:
document.getElementById("share-but").addEventListener("click", function(){
    $("#share").dialog();
},false)

function addshare(){
    const name=document.getElementById("share-username").value;
    const pass = document.getElementById("share-password").value;
    const data ={'username':name, 'password':pass,'share':1};
    let shareuser = null; 
    fetch("login.php",{
        method:'POST',
        body: JSON.stringify(data),
        heaers:{'content-type':'application/json'}
    }).then(response=>response.json())
    .then(data => {
        if(data.success){
            $("#share").dialog('close'); 
            shareuser = data.userid;
            share(shareuser);
        }
        else{
            alert("share failed");
        }
    
    })
}
document.getElementById("sharesub").addEventListener("click", addshare,false);

function share(id){
    //alert(name);
    //alert(id);
    const data = {'id':id}
     fetch('share.php',{
        method:'POST',
                body:JSON.stringify(data),
                headers:{'content-type': 'application/json'}
    }).then(response => response.json()).then(data=>{
   
        let temp=data.events;
        for(let j=0;j< temp.length;j++){
            let e = (temp[j]);
            const  desc=e['desc'];
            const  t= e['t'];
            const  tag=e['tag'];
            const y=e['y'];
            const m=e['m'];
            const d=e['d'];
            
            const data = {'year':y,'month2':m,'day':d,'time':t,'desc':desc,'tag':tag,'token':token};

            fetch('addevent.php',{
                method:'POST',
                body:JSON.stringify(data),
                headers:{'content-type': 'application/json'}
            })
            .then(response=>response.json())
            .then(data =>{
                if(data.success){
                    alert("add success");
                }else{
                    alert(data.message);
                }
            }).then(updateCalendar()).then(uploadEvent())
         }
})
}
function addGroup(){
    let time = document.getElementById("gtime").value;
    let year = document.getElementById("gyear").value;
    let month2 = document.getElementById("gmonth2").value;
    let day = document.getElementById("gday").value;
    let desc = document.getElementById("gdesc").value;
    let tag="a";
    if (document.getElementById("ggroupb").checked){
        tag="b"
    }else{
        tag="a";
    }
    let uid1 = document.getElementById("member1").value;
    
    if (uid1!=null){
        const data = {'name':uid1};
        fetch('group.php',{
            method:'POST',
            body:JSON.stringify(data),
            headers:{'content-type': 'application/json'}
        }).then(response=>response.json()).then(data =>{
         let u = data.id;
         const data2 = {'year':year,'month2':month2,'day':day,'time':time,'desc':desc,'tag':tag,'ui':u,'token':token};
         fetch('addevent.php',{
            method:'POST',
            body:JSON.stringify(data2),
            headers:{'content-type': 'application/json'}
        })
        .then(response => response.json())
        .then(data =>{
            if(data.success){
                //alert("add success");
            }else{
                alert(data.message);
            }
        })
    })}

    let uid2 = document.getElementById("member2").value;
    if (uid2!=null){
        const data = {'name':uid2};
        fetch('group.php',{
            method:'POST',
            body:JSON.stringify(data),
            headers:{'content-type': 'application/json'}
        }).then(response=>response.json()).then(data =>{
         let u = data.id;
         const data2 = {'year':year,'month2':month2,'day':day,'time':time,'desc':desc,'tag':tag,'ui':u,'token':token};
         fetch('addevent.php',{
            method:'POST',
            body:JSON.stringify(data2),
            headers:{'content-type': 'application/json'}
        })
        .then(response => response.json())
        .then(data =>{
            if(data.success){
                //alert("add success");
            }else{
                alert(data.message);
            }
        })
    })}
    $("#gevent").dialog('close');
    
         }

    
    
    

document.getElementById("group_events").addEventListener("click",function(){
    $("#gevent").dialog();
    document.getElementById("gadd").addEventListener("click",addGroup,false);
},false);

document.getElementById("login").addEventListener("click", function(event){
           
    $("#login1").dialog('close');
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;
    const data = {'username':username, 'password':password};
    
    let xmlHttp = new XMLHttpRequest();
    // xmlHttp.open("POST","angel.php",true);
    // xmlHttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
    // xmlHttp.addEventListener("load",function(event){
    //     let jsonData = JSON.parse(event.target.responseText);
    //     if(jsonData.success){
    //         alert("welcome new user!");
    //     }else{
    //         alert("Register failed. Try again!");
    //     }
    // },false);
    // xmlHttp.send("username="+username+"&password="+password);
    fetch("login.php", {
        method:'POST',
        body:JSON.stringify(data),
        headers:{'content-type':'application/json'}
    })
    .then(response => response.json())
    .then(data => {
        
    if(data.success){
            token=data.token
            $("#login-btn").hide();
            $("#logout-btn").show();
            $("#signup-btn").hide();
            $("#add-btn").show();
            alert("Log in Successfully!");
        }else{
        alert( 'Log in failed+${data.message}' );}
    })
    

},false);

