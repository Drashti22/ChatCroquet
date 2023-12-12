import {PawnBehavior} from "../PrototypeBehavior";
 
class ChatPawn extends PawnBehavior {
    async setup() {
        
        let currentuser = this.actor.service("PlayerManager").players.get(this.viewId)._name
        const welcomediv = document.getElementById("currentuser");
        welcomediv.innerHTML = `Welcome, ${currentuser}`
        try{
            let avatars = await this.actor.service("PlayerManager").players
            console.log(avatars);
            console.log("Type of avatars:", typeof avatars);
            console.log("Content of avatars:", avatars);

        const userDiv = document.getElementById('users'); 
        userDiv.innerHTML = '';

        for (const [playerId, avatarActor] of avatars.entries()) { 
            console.log("Player ID:", playerId);
            console.log("Avatar Name:", avatarActor._name);
            //actorNames.push(avatarActor._name);
            const userElement = document.createElement('div');
            userElement.innerHTML = avatarActor._name;
            userElement.addEventListener('click', () => this.openChat(avatarActor));
            userDiv.appendChild(userElement);    
        }
        }
        catch(e){
            console.log(e);
        }
        const options = {
            method: "POST",
            headers: {
              accept: "application/json",
              "content-type": "application/json",
              "X-DE-SCOPE": "1688541856746496.DE_1688541856746499",
            },
            body: JSON.stringify({ grant_type: "guest" }),
          };
            fetch("https://api.beamable.com/basic/auth/token", options)
      .then((response) => response.json())
      .then((response) => {
        localStorage.setItem("access_token", response.access_token);
      })
      .catch((err) => console.error(err));  
    }

        openChat(avatarActor) {
        var messages = [];
        let sender = this.actor.service("PlayerManager").players.get(this.viewId)._name
        let token= localStorage.getItem("access_token")
        const api = 'https://api.beamable.com/basic/1688541856746496.DE_1688541856746499.DESKTOP-O4OCVHHmicro_chat/GetMessage';
        const options = {
            method: "POST",
            headers: {
              accept: "application/json",
              "content-type": "application/json",
              "X-DE-SCOPE": "1688541856746496.DE_1688541856746499",
              Authorization: `Bearer ${token}`,
            },
            body : JSON.stringify({
                sender: sender, 
                receiver : avatarActor._name
            }),
          };
            fetch(api, options).then(response => response.json())
            .then(res => {
                console.log(res)
                const chatDiv = document.getElementById('chat');
                chatDiv.style.backgroundColor = 'white';
                chatDiv.style.display = 'block';
                messages = res
                chatDiv.innerHTML= `${avatarActor._name}<br>
                ${res.map(message => message + '<br>').join('')}
                <input type="text" placeholder="send message..." id="message">
                <input type="button" value="send" id="send-button">
                `;
                const sendButton = document.getElementById("send-button");
                sendButton.onclick = () => this.sendMessage(avatarActor._name, messages);

            } 
            )
            
        }
        sendMessage(userName, messages){
            let token= localStorage.getItem("access_token")
            let sender = this.actor.service("PlayerManager").players.get(this.viewId)._name
            const messageInput = document.getElementById('message');
            const message = messageInput.value;
            const api = "https://api.beamable.com/basic/1688541856746496.DE_1688541856746499.DESKTOP-O4OCVHHmicro_chat/SaveMessage";
            const options = {
                method: "POST",
                headers: {
                  accept: "application/json",
                  "content-type": "application/json",
                  "X-DE-SCOPE": "1688541856746496.DE_1688541856746499",
                  Authorization: `Bearer ${token}`,
                },
                body : JSON.stringify({
                    message: message, // Corrected property name
                    receiver: userName, 
                    sender: sender
                }),
              };
            fetch(api, options)
            .then(response => response.json())
            .then(res=>{
                console.log(res);
                messages.push(res.Message);
                const chatDiv = document.getElementById('chat');
                chatDiv.innerHTML = `${userName}<br>
                ${messages.map(msg => msg + '<br>').join('')}
                <input type="text" placeholder="send message..." id="message">
                <input type="button" value="send" id="send-button">
                `;

            // Clear the message input
            messageInput.value = '';
            })
            console.log(`Sending message "${message}" to ${userName}`);
        }
}
export default {
    modules: [
        {
            name: "chat",
            pawnBehaviors: [ChatPawn]
        }
    ]
}
