//adding new chat documents
//setting up a real-time listerner to get new chats
//updating the username
//updating the room

class Chatroom{
    constructor(room, username){
        this.room = room;
        this.username = username;
        this.chats = db.collection('chat');
        this.unsub;
    }

    async addChat(message){
        //format a chat object 
        const now = new Date();
        const chat = {
            message,
            username: this.username,
            room: this.room,
            created_at: firebase.firestore.Timestamp.fromDate(now)
        };

        //save the chat document
        const response = await this.chats.add(chat);
        return response;
    }

    getChats(callback){
        this.unsub = this.chats
            .where('room', '==', this.room)
            .orderBy('created_at')
            .onSnapshot(snapshot => {
                snapshot.docChanges().forEach(change => {
                    if(change.type === 'added'){
                        // update the ui
                        callback(change.doc.data());
                    }
                });
            });
    }

    updateName(username){
        this.username = username;
        localStorage.setItem('username', username);
    }
    updateRoom(room){
        this.room = room; 
        if(this.unsub){
            this.unsub();
        }
    }

}

