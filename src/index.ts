const socket = io();
const form = document.getElementById('form') as HTMLFormElement;
const message_input = document.getElementById('input') as HTMLInputElement;
const messages = document.getElementById('messages') as HTMLUListElement;

form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!message_input.value.trim()) return;
    socket.emit('new_message', message_input.value.trim());
    message_input.value = '';
});

socket.on('all_messages', function (msgArray:string[]) {
    msgArray.forEach((msg:any) => {
        let item = document.createElement('li')
        item.textContent = msg.login + ': ' + msg.content; 
        messages.appendChild(item);
    })
    window.scrollTo(0, document.body.scrollHeight);
})

socket.on('message', (msg:string) => {
    let item = document.createElement('li');
    item.textContent = msg;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);

});



