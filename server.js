const express=require("express");
const app=express();
const http=require("http").createServer(app);

const PORT = process.env.PORT || 8000;

app.use(express.static(__dirname+"/public"));

http.listen(PORT);

app.get("/",function(req,res)
{
    res.sendFile(__dirname+"/index.html");
})

const io=require("socket.io")(http);

io.on("connection",(socket)=>
{
    console.log("Connected");

    socket.on("message",function(content)
    {
        socket.broadcast.emit("message",content);
    })

})