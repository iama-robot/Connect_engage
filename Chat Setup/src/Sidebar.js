import React, {useState,useEffect} from 'react';
import './Sidebar.css';
import {Avatar} from "@material-ui/core";
import SidebarChat from "./SidebarChat";
import db from './firebase';
import { useStateValue } from './StateProvider';

function Sidebar(props){

    const [rooms, setRooms] = useState([]);
    const [{user},dispatch] = useStateValue();

    //Add user if not added already in the database
    useEffect(() => {
    db.collection('Users').where('Gmail', '==', user.email).get()
        .then((querySnapshot) => {
            if (querySnapshot.empty) {
                db.collection('Users').add({
                    name: user.displayName,
                    Gmail: user.email
                })
                console.log('added ', user.displayName)
            }
        }).catch((error) => {
        console.log(error);
        });
    })
    
    
    //To display only the rooms which belong to the user 
    //The user database has name and id of the room that the user belongs to
    useEffect(() => {
        let userId;
        db.collection('Users').where('Gmail', '==', user.email)
        .onSnapshot(snapshot => (snapshot.docs.forEach(doc => {
                userId= doc.id
            db.collection('Users').doc(userId).collection('RoomID')
            .onSnapshot(snapshot => (setRooms(snapshot.docs.map(doc => (
                    {
                        data: doc.data()
                    }
                )
                ))
            ));
            console.log('this: ',userId)
        }) 
        ))
    },[user.email]);

    
    return(
        <div className='sidebar'>
            <div className= 'sidebar_header'>
                <Avatar src={user?.photoURL}/> 
                <h3>{user.displayName}</h3>
                <div className='sidebar_headerRight'>
                    
                </div>    
            </div>
            <div className= 'sidebar_chats'>
                <SidebarChat addNewChat/>
                {rooms.map(room=> (
                    <SidebarChat key={room.data.roomid} 
                    id={room.data.roomid} name={room.data.roomname}/>
                ))}
            </div>
         </div>
    );
}

export default Sidebar;
