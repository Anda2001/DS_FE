import React, { useEffect, useState } from 'react'
import {over} from 'stompjs';
import SockJS from 'sockjs-client';
import * as API_USERS from "../person/api/person-api";
import NavBar from "../nav-bar";

var stompClient =null;


const ChatRoom = (props) => {
    const {user} = props;
    const [privateChats, setPrivateChats] = useState(new Map());
    const [publicChats, setPublicChats] = useState([]);
    const [tab,setTab] =useState("CHATROOM");
    const [users, setUsers] = useState([]);
    const [userData, setUserData] = useState({
        username: user.name,
        receivername: '',
        connected: false,
        message: ''
    });
    useEffect(() => {
        console.log(userData);
        console.log(user);
        console.log("Users",users);

    }, [users]);

    useEffect(() => {
        setUserData(currentData => ({...currentData, username: user.name}));
    }, [user.username]);

    useEffect(() => {
        const fetchUsers = async () => {
            await API_USERS.getPersons((result, status, err) => {
                if (result !== null && status === 200) {
                    setUsers(result);
                }
            });
        };

        fetchUsers();
        connect();
    }, []);

    useEffect(() => {
        console.log("users hey",users);
        // Initialize private chats for each user
        const newPrivateChats = new Map(privateChats);
        users.forEach(user => {
            if (!newPrivateChats.has(user.name)) {
                newPrivateChats.set(user.name, []);
                console.log("newPrivateChats", newPrivateChats);
            }
        });
        setPrivateChats(newPrivateChats);
    } , [users]);


    const connect =()=>{
        let Sock = new SockJS('http://localhost:8088/ws');
        stompClient = over(Sock);
        stompClient.connect({},onConnected, onError);
    }

    const onConnected = () => {
        setUserData({...userData,"connected": true});
        stompClient.subscribe('/chatroom/public', onMessageReceived);
        stompClient.subscribe('/user/'+userData.username+'/private', onPrivateMessage);
        userJoin();
    }

    const userJoin=()=>{
        var chatMessage = {
            senderName: userData.username,
            status:"JOIN"
        };
        stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
    }


    const onMessageReceived = (payload)=>{
        var payloadData = JSON.parse(payload.body);
        switch(payloadData.status){
            case "JOIN":
                if(!privateChats.get(payloadData.senderName)){
                    privateChats.set(payloadData.senderName,[]);
                    //setPrivateChats(new Map(privateChats));
                }
                break;
            case "MESSAGE":
                publicChats.push(payloadData);
                setPublicChats([...publicChats]);
                break;
        }
    }

    const onPrivateMessage = (payload)=>{

        console.log(payload);
        var payloadData = JSON.parse(payload.body);
        console.log(payloadData);
        console.log("!!!", privateChats);
        console.log(privateChats.get(payloadData.senderName));
        if(privateChats.get(payloadData.senderName)){
            privateChats.get(payloadData.senderName).push(payloadData);
            setPrivateChats(new Map(privateChats));
        }else{
            let list =[];
            list.push(payloadData);
            privateChats.set(payloadData.senderName,list);
            setPrivateChats(new Map(privateChats));
        }
    }

    const onError = (err) => {
        console.log(err);

    }

    const handleMessage =(event)=>{
        const {value}=event.target;
        setUserData({...userData,"message": value});
    }
    const sendValue=()=>{
        if (stompClient) {
            var chatMessage = {
                senderName: userData.username,
                message: userData.message,
                status:"MESSAGE"
            };
            console.log(chatMessage);
            stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
            setUserData({...userData,"message": ""});
        }
    }

    const sendPrivateValue=()=>{
        if (stompClient) {
            var chatMessage = {
                senderName: userData.username,
                receiverName:tab,
                message: userData.message,
                status:"MESSAGE"
            };

            if(userData.username !== tab){
                console.log("privateChats",privateChats);
                privateChats.get(tab).push(chatMessage);
                setPrivateChats(new Map(privateChats));
                console.log("privateChats",privateChats);
            }
            stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
            setUserData({...userData,"message": ""});
        }
    }

    const handleUsername=(event)=>{
        const {value}=event.target;
        setUserData({...userData,"username": value});
    }


    return (
        <div>
            <NavBar/>

            <div className="container" style={{ display: 'flex', flexDirection: 'row', color: 'white', backgroundColor: '#20B2AA' }}>
                <div className="member-list" style={{ flexBasis: '200px', borderRight: '1px solid #ccc', padding: '10px' }}>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        <li onClick={()=>{setTab("CHATROOM")}} className={`member ${tab==="CHATROOM" && "active"}`} style={{ padding: '10px', backgroundColor: tab==="CHATROOM" ? 'white' : 'transparent', cursor: 'pointer', borderRadius: '5px', marginBottom: '10px', color: tab==="CHATROOM" ? 'black' : 'white' }}>
                            <i className="fas fa-comments" style={{ marginRight: '10px' }}></i>Chatroom
                        </li>
                        {[...privateChats.keys()].map((name,index)=>(
                            <li onClick={()=>{setTab(name)}} className={`member ${tab===name && "active"}`} key={index} style={{ padding: '10px', backgroundColor: tab===name ? 'white' : 'transparent', cursor: 'pointer', borderRadius: '5px', marginBottom: '10px', color: tab===name ? 'black' : 'white' }}>
                                <i className="fas fa-comments" style={{ marginRight: '10px' }}></i>{name}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="chat-box" style={{ flexGrow: 1, padding: '10px' }}>
                    {tab==="CHATROOM" && <div className="chat-content">
                        <ul className="chat-messages" style={{ listStyle: 'none', padding: 0 }}>
                            {publicChats.map((chat,index)=>(
                                <li className={`message ${chat.senderName === userData.username && "self"}`} key={index} style={{ backgroundColor: '#F0F0F0', padding: '10px', borderRadius: '5px', marginBottom: '10px', color: 'black' }}>
                                    {chat.senderName !== userData.username && <div className="avatar">{chat.senderName}</div>}
                                    <div className="message-data">{chat.message}</div>
                                    {chat.senderName === userData.username && <div className="avatar self">{chat.senderName}</div>}
                                </li>
                            ))}
                        </ul>

                        <div className="send-message" style={{ marginTop: '10px' }}>
                            <input type="text" className="input-message" placeholder="enter the message" value={userData.message} onChange={handleMessage} style={{ marginRight: '10px', padding: '10px', borderRadius: '5px', border: 'none' }} />
                            <button type="button" className="send-button" onClick={sendValue} style={{ padding: '10px', borderRadius: '5px', border: 'none', backgroundColor: 'lightblue', cursor: 'pointer' }}>send</button>
                        </div>
                    </div>}
                    {tab!=="CHATROOM" && <div className="chat-content">
                        <ul className="chat-messages" style={{ listStyle: 'none', padding: 0 }}>
                            {[...privateChats.get(tab)].map((chat,index)=>(
                                <li className={`message ${chat.senderName === userData.username && "self"}`} key={index} style={{ backgroundColor: '#F0F0F0', padding: '10px', borderRadius: '5px', marginBottom: '10px', color: 'black' }}>
                                    {chat.senderName !== userData.username && <div className="avatar">{chat.senderName}</div>}
                                    <div className="message-data">{chat.message}</div>
                                    {chat.senderName === userData.username && <div className="avatar self">{chat.senderName}</div>}
                                </li>
                            ))}
                        </ul>

                        <div className="send-message" style={{ marginTop: '10px' }}>
                            <input type="text" className="input-message" placeholder="enter the message" value={userData.message} onChange={handleMessage} style={{ marginRight: '10px', padding: '10px', borderRadius: '5px', border: 'none' }} />
                            <button type="button" className="send-button" onClick={sendPrivateValue} style={{ padding: '10px', borderRadius: '5px', border: 'none', backgroundColor: 'lightblue', cursor: 'pointer' }}>send</button>
                        </div>
                    </div>}
                </div>
            </div>
            <div
                style={{
                    position: 'fixed',
                    bottom: '0',
                    width: '100%',
                    backgroundColor: '#20B2AA',
                    color: 'white',
                    padding: '10px',
                    textAlign: 'center'
                    }}
            >
                You are connected as {user.name}
            </div>

        </div>
    )
}

export default ChatRoom