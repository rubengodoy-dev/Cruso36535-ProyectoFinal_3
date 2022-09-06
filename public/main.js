//let URL_SOCKET = 'http://localhost:3000'  //DEV
let URL_SOCKET = 'https://rhg-final-coder.herokuapp.com' //PROD

let socket = io.connect(URL_SOCKET, {
  'forceNew': true
});
let roomMail = prompt("Ingrese el mail para el canal de chat")
socket.emit('create-room', roomMail)

socket.on('messages', function (data) {
  console.log(data);
  render(data);
});
function render(data) {
  var html = data.map(function (elem, index) {
    return (`<div>
            <strong>${elem.type}</strong>: 
            <em>${elem.content}</em>
            <em>${elem.date}</em>
             </div>`);
  }).join(" ");
  document.getElementById('messages').innerHTML = html;
}
function addMessage(e) {
  var message = {
    email: roomMail,
    type: 'usuario',
    content: document.getElementById('texto').value
  };

  postData(URL_SOCKET+'/chat', message)
    .then(data => {
      console.log(data)
    });

  //socket.emit('new-message', message); 
  return false; 
}

async function postData(url = '', data = {}) {
  // Opciones por defecto estan marcadas con un *
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}