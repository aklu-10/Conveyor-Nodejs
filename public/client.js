const socket=io();

let username;

do{
    
    username=prompt("Enter your name : ");

}while(!username)

let messageBox=document.querySelector("#message");
let file=document.querySelector("#myFile");
let chatArea=document.querySelector(".chat_area");
let send=document.querySelector(".submit");
let uploaded_data='';
let file_uploaded=false;

messageBox.addEventListener("keyup",function(e)
{
    document.querySelector(".chat_area .default_text").style.display="none";

    if(e.key=="Enter" && e.target.value)
    {
        sendMessage({ username:username, msg:messageBox.value },"outgoing");
    }
})

send.addEventListener("click",function(e)
{
    document.querySelector(".chat_area .default_text").style.display="none";

    if(messageBox.value)
    {
        sendMessage({ username:username, msg:messageBox.value },"outgoing");
        messageBox.value='';
    }
})


function sendMessage(msg,type)
{
    if(file_uploaded){
        appendMessage(msg,type,true);

    }
    else{
        appendMessage(msg,type);
        socket.emit("message",{ username:username, msg:messageBox.value });
        messageBox.value='';
    }
}

function appendMessage(msg,type,file_passed=false)
{
    
    let div=document.createElement("div");
    div.classList.add("message",type);

    let context=`<h6>${msg.username}</h6>
                 <p>${msg.msg}</p>`;

    div.innerHTML=context;
                 
    if(file_passed)
    {
        let img=document.createElement("img");
        img.src=msg.image;
        if(msg.msg)
            div.appendChild(img);
        else
            div.innerHTML=`<img src=${msg.image}></img>`;

    }
    
    chatArea.appendChild(div);
    
    uploaded_data='';
    file.value='';
    file_uploaded=false;
    scrollToBottom();


}

file.addEventListener("change",function()
{
    document.querySelector(".chat_area .default_text").style.display="none";

    let reader=new FileReader();
    reader.addEventListener("load",function()
    {
        uploaded_data=reader.result;
        file_uploaded=true;
        sendMessage({ username:username, msg:messageBox.value, image:uploaded_data },"outgoing")
        socket.emit("message",{ username:username, msg:messageBox.value, image:reader.result });
    })

    reader.readAsDataURL(file.files[0]);
})

function scrollToBottom()
{
    chatArea.scrollTop=chatArea.scrollHeight;

}


socket.on("message",function(content)
{
    if(content.image)
        appendMessage(content,"incoming",true);
    else
        appendMessage(content,"incoming");
})





