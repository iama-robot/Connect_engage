import React, {useEffect, useState} from 'react';
import {Avatar} from "@material-ui/core";
import './SidebarChat.css';
import db from './firebase';
import {Link} from 'react-router-dom';
import { useStateValue } from './StateProvider';

//The SidebarChat function gets called by the Sidebar based on which rooms the user belongs to
// It transfers the room parametes to the SidebarChat function
function SidebarChat({id,name,addNewChat}) {
    const [seed, setSeed] = useState("");
    const [messages, setMessages] = useState("");
    const [{user}, dispatch] = useStateValue();
    let userId;
    
    //
    useEffect(() => {
        if(id){
            db.collection('rooms').doc(id).collection('messages')
            .orderBy('timestamp','desc').onSnapshot(snapshot => {
                setMessages(snapshot.docs.map((doc) => doc.data()))
            })
        }
    }, [id]);

    // Generate randomized Avatar
    useEffect(() => {
        setSeed(Math.floor(Math.random() * 5000));        
    }, []);

    // Creates new room when the user clicks add new chat in the Sidebar
    // Stores the name and id of the room created in both the room and the user's collection
    const createChat= () => {
        const roomName= prompt("Please enter name for chat");
        if(roomName){
            db.collection("rooms").add({
                name: roomName
            }).then(function(docRef) {
                db.collection('Users').where('Gmail', '==', user.email)
                .get().then(snapshot => {
                snapshot.docs.forEach(doc => {
                    userId= doc.id
                    db.collection('Users').doc(userId).collection('RoomID').add({
                        roomid: docRef.id,
                        roomname: roomName
                        })
                    })
                })  
                .catch(function(error) {
                    console.error("Error while finding User: ", error);
                });
            })
            .catch(function(error) {
                console.error("Error while adding room: ", error);
            });
        }
    };

    return !addNewChat ? (
        <Link to={`/rooms/${id}`} key={id}>
            <div className="sidebarChat">
                <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`}/>
                <div className="sidebarChat_info">
                    <h2>{name}</h2>
                    <p>{messages[0]?.message}</p>
                </div>
            </div>
        </Link>
        
    ) : (
        <div onClick={createChat} className="sidebarChat">
            <h3 className="add-new-chat-title">Add New Chat</h3>
        </div>
    )
}

export default SidebarChat;
