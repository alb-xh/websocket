
const addNewChatMessage = (msg) => {
  const { user, color, text } = msg;

  const listItem = document.createElement('li');
  listItem.innerHTML = `<span style="color:${color};">${user}&nbsp;</span>${text}`;

  document.getElementById('chat_list')
    .appendChild(listItem);
}

async function connectToServer() {
  const ws = new WebSocket('ws://localhost:7000/ws');

  ws.onmessage = (event) => {
    const { type, value } = JSON.parse(event.data);

    if (type === 'name') {
      alert(value);
    }

    if (type === 'chat_new_message') {
      console.log(value);
      addNewChatMessage(value);
    }
  }

  return new Promise((resolve, reject) => {

    const timer = setInterval(() => {
      if (ws.readyState === 1) {
        clearInterval(timer);
        resolve(ws);
      }
    }, 10);
  });
};

const getUserName = () => document.getElementById('username')
  .value;

const getPost = () => document.getElementById('post')
.value;

const addListeners = (ws) => {
  document.getElementById('connect_button')
    .addEventListener('click', () => {
      const name = getUserName();
      if (name) {
        const action = {
          type: 'name',
          value: name
        };

        ws.send(JSON.stringify(action));
      }
    })

  document.getElementById('post_button')
  .addEventListener('click', () => {
    const name = getUserName();
    const post = getPost();
    if (name && post) {
      const action = {
        type: 'chat_new_message',
        value: { name, text: post },
      };

      ws.send(JSON.stringify(action));
    }
  })
}

const main = async () => {
  const ws = await connectToServer();

  addListeners(ws);
};

main();
