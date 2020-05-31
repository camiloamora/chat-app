import React, { useState, useEffect } from 'react';
import queryString  from 'query-string';
import io from 'socket.io-client';
import './Chat.css';

import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';

let socket;

const Chat = ({ location }) => {
    const [ name, setName ] = useState('');
    const [ room, setRoom ] = useState('');
    const [ message, setMessage ] = useState('');
    const [ messages, setMessages ] = useState([]);
    const ENDPOINT = 'localhost:5000';
    useEffect(() => {
        // Retrieve data from queryString
        const { name, room } = queryString.parse(location.search);
        socket = io(ENDPOINT);

        console.log(socket);
        setName(name);
        setRoom(room);
        // example implementation callback error
        // socket.emit('join',{ name, room }, ({ error }) => {
        //     alert(error);
        // });

        socket.emit('join',{ name, room }, () => {
            
        });
        return () => {
            socket.emit('disconnect');
            socket.off();
        }
    }, [ENDPOINT, location.search]);

    useEffect(() => {
        socket.on('messages', (message) => {
            setMessage([...messages, message]);
        });
    },[messages]);

    //function for sending messages
    const sendMessage = (event) => {
        event.preventDefault();
        if(message) {
            socket.emit('sendMessage',message, () => setMessage(''));
        }
    }

    console.log(message, messages);

    return(
        <div className="outerContainer">
            <div className="container">
                <InfoBar room={room} />
                <Input message={message} setMessage={setMessage} sendMessage={sendMessage}/>
                {/* <input valur={message} 
                onChange={(event) => setMessage(event.target.value)}
                onKeyPress={event => event.key === 'Enter' ? sendMessage(event) : null}/> */}
            </div>
        </div>
    )
}

export default Chat;