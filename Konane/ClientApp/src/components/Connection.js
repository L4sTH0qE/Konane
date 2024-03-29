/*
import * as signalR from '@aspnet/signalr';

export const connection = new signalR.HubConnectionBuilder()
    .withUrl("/notificationHub")
    .build();

console.log("Created SignalR hub");
connection.on("AddUser", (message) => {
    console.log("Updated to SignalR hub");
});

connection.start().then(() => {
    console.log("Connected to SignalR hub");
}).catch((error) => {
    console.error(error);
});

export function addUser(name) {
    fetch('/user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: name })
    });
    console.log("testSend");
}*/
