import React, { useEffect, useState } from 'react';
import "./Chat.css";
import {Avatar, IconButton} from '@material-ui/core';
import AddBoxIcon from '@material-ui/icons/AddBox';
import VideoCallIcon from '@material-ui/icons/VideoCall';
import { useParams } from 'react-router-dom';
import db from './firebase';
import firebase from 'firebase';
import {useStateValue} from "./StateProvider";
import {Link} from 'react-router-dom';


function Chat() {

    const[input, setInput]= useState('');
    const[seed, setSeed]= useState('');
    const {roomId} = useParams();
    const [roomName, setRoomName] = useState("");
    const [messages, setMessages] = useState([]);
    const [{user}, dispatch] = useStateValue();
    let userId;
    
    
    // To show the particular chat (room name + messages)
    // based on roomId received through the link
    useEffect(()=>{
        if(roomId){
            db.collection('rooms').doc(roomId).onSnapshot(snapshot => {
                setRoomName(snapshot.data().name);
            });

            db.collection('rooms').doc(roomId).collection("messages")
            .orderBy("timestamp","asc").onSnapshot(snapshot => {
                setMessages(snapshot.docs.map(doc => doc.data()))
            });
        }
    },[roomId])

    // Generate random Avatars
    useEffect(() => {
        setSeed(Math.floor(Math.random()*5000));
    }, [roomId]);

    //Saves (message+ name of sender +timestamp) in the database when enter is pressed
    const sendMessage  = (e) => {
        e.preventDefault();    
        db.collection('rooms').doc(roomId).collection('messages').add({
            message: input,
            name: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        })
        setInput("");
    };

    //take the GmailID of member to be added and tweak the room details in the database
    const addParticipant= () => {
        const participant= prompt("Please enter gmail id of new participant");
        db.collection('Users').where('Gmail', '==', participant).get()
        .then(snapshot => {
            snapshot.docs.forEach(doc => {
                userId= doc.id
                db.collection('Users').doc(userId).collection('RoomID').add({
                    roomid: roomId,
                    roomname: roomName
                })
            })
        })
        .catch(function(error) {
            console.error("Error occured while adding new member: ", error);
        }); 
    };

    return (
        // Chat part
        <div className='chat'>
            <div className= 'chat_header'>
                <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`}/>
                <div className='chat_headerInfo'>
                    <h3 className='chat-room-name'>{roomName}</h3>
                    <p className='chat-room-last-seen'>
                        Last seen {" "}
                        {new Date(
                            messages[messages.length - 1]?.timestamp?.toDate()
                        ).toUTCString()}
                    </p>
                </div>

                <div className ='chat_headerRight'>
                    <IconButton>
                        <AddBoxIcon onClick={addParticipant}/>
                    </IconButton>
                    <IconButton>
                        <a href='https://afternoon-waters-52251.herokuapp.com/'>
                        <VideoCallIcon /></a>
                    </IconButton>                    
                </div>

            </div>
            <div className= 'chat_body'>
                    {messages.map(message => (
                        <p className={`chat_message ${ message.name === user.displayName && 'chat_receiver'}`}>
                            <span className="chat_name">{message.name}</span>
                            {message.message}
                            <span id="chat_timestemp">
                            {new Date(message.timestamp?.toDate()).toUTCString()}</span>
                        </p>
                    ))} 
           </div>

            <div className= 'chat_footer'>
                <form>
                <input value={input} onChange={(e) => setInput(e.target.value)}
                 type="text" placeholder="Type a message"/>
                <button onClick={sendMessage} type="submit"> Send a Message</button>
                </form>
            </div>
        </div>
    )
};

export default Chat
