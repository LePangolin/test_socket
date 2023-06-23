const socket = io();
let connected = false;


document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("envoie").addEventListener("click", (e) => {
        let pseudo = document.getElementById("pseudo").value;
        let message = document.getElementById("message").value;
        if(pseudo && message && pseudo.trim() != "" && message.trim() != ""){
            socket.emit("message", {pseudo, message});
            document.getElementById("message").value = "";
            document.getElementById("message").focus();
        }
        if(pseudo.trim() == "" || !pseudo){
            alert("Veuillez entrer un pseudo");
        }
        if(message.trim() == "" || !message){
            alert("Veuillez entrer un message");
        }
    });

    socket.on("message", (data) => {
        createMessage(data);
        document.getElementById("message-container").scrollTop = document.getElementById("message-container").scrollHeight;

    });

    socket.on("connected", (data) => {
        if(!connected){
            socket.emit('getMessages');
        }   
    });
    

    socket.on("getMessages", (data) => {
        if(!connected){
            connected = true;
            data.msg.forEach(element => {
                createMessage(element);
            });
            document.getElementById("message-container").scrollTop = document.getElementById("message-container").scrollHeight;
        }
    });
    
});

function createMessage(data){
    let message = document.createElement("div");
    message.className = "message-recu";
    message.innerHTML = "<p>" + data.pseudo + " <br> " + data.message + "</p>";
    document.getElementById("message-container").appendChild(message); 
} 