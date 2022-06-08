const { WebSocketServer } = require('ws');


const users = [];
const connections = [];

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

const broadcast = (msg) => {
  connections.forEach((connection) => {
    connection.send(JSON.stringify(msg));
  });
};

const userExists = (name) => users.some((user) => user.name === name);

const actions = {
  'name': (connection, name) => {
    let value;

    if (!name || typeof name !== 'string') {
      value = 'Invalid name';
    } else if (userExists(name)) {
      value = 'Name is already used';
    } else {
      const newUser = { name, color: getRandomColor() };

      users.push(newUser);
      connections.push(connection);

      value = 'User is added';
    }

    broadcast({
      type: 'name',
      value,
    })
  },
  'chat_new_message': (connection, msg) => {
    const { name, text } = msg;
    const user = users.find((user) => user.name === name);

    if (!user) return;

    broadcast({
      type: 'chat_new_message',
      value: {
        user: user.name,
        color: user.color,
        text,
      },
    });
  }
}

const wss = new WebSocketServer({
  port: 7000,
});

wss.on('listening', () => {
  console.log('Server');
})

wss.on('connection', (ws) => {
  console.log('NEW CLIENT');

  ws.on('message', (message) => {
    console.log('MESSAGE');
    console.log(JSON.parse(message.toString()));

    const { type, value } = JSON.parse(message.toString());

    if (actions[type]) {
      actions[type](ws, value);
    }
  });

  ws.on('close', () => {
    console.log('CLOSE');
  })
});
