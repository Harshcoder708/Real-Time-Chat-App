 const socket = io();
        let currentRoom = '';
        let username = '';
        let avatarSeed = Math.floor(Math.random() * 1000);

        // Avatar generator: returns emoji based on seed
        function getAvatar(seed) {
            const emojis = ["😎","🦉","🐱","🦄","🐸","🐧","🐼","🐶","🐨","🦊","🐵","🐯","🦁","🐺","🐰","🐹","🐻","🐮","🐷"];
            return emojis[seed % emojis.length];
        }

        // Modal join logic
        const joinModal = document.getElementById('joinModal');
        const usernameInput = document.getElementById('usernameInput');
        const roomInput = document.getElementById('roomInput');
        const joinBtn = document.getElementById('joinBtn');

        joinBtn.onclick = function() {
            username = usernameInput.value.trim() || "Anonymous";
            currentRoom = roomInput.value.trim() || "general";
            avatarSeed = username.split('').reduce((a, c) => a + c.charCodeAt(0), avatarSeed);
            socket.emit('joinRoom', { username, room: currentRoom });
            joinModal.style.display = 'none';
            updateSidebarUser();
            updateChannelHeader();
            document.getElementById('message').placeholder = `Message #${currentRoom}`;
        };

        // Channel list UI
        const channelsElem = document.getElementById('channels');
        const channelHeader = document.getElementById('channelHeader');
        let channels = ["general", "tech", "random"];
        function renderChannels() {
            channelsElem.innerHTML = "";
            channels.forEach(ch => {
                const div = document.createElement('div');
                div.className = 'channel' + (ch === currentRoom ? ' selected' : '');
                div.textContent = `#${ch}`;
                div.onclick = () => {
                    if (ch !== currentRoom) {
                        currentRoom = ch;
                        socket.emit('joinRoom', { username, room: currentRoom });
                        updateChannelHeader();
                        document.getElementById('message').placeholder = `Message #${currentRoom}`;
                        messagesElem.innerHTML = "";
                        renderChannels();
                    }
                };
                channelsElem.appendChild(div);
            });
        }
        function updateChannelHeader() {
            channelHeader.textContent = `#${currentRoom}`;
            renderChannels();
        }

        // Sidebar user info
        function updateSidebarUser() {
            document.getElementById('sidebarAvatar').textContent = getAvatar(avatarSeed);
            document.getElementById('sidebarUsername').textContent = username;
        }

        // Message sending and display
        const sendBtn = document.getElementById('sendBtn');
        const messageInput = document.getElementById('message');
        const messagesElem = document.getElementById('messages');

        sendBtn.onclick = sendMessage;
        messageInput.onkeydown = function(e) { if(e.key === "Enter") sendMessage(); };

        function sendMessage() {
            const text = messageInput.value.trim();
            if (text && currentRoom) {
                socket.emit('chatMessage', { username, room: currentRoom, text, avatar: getAvatar(avatarSeed) });
                messageInput.value = '';
            }
        }

        // Show messages with avatar, user, text, and time
        socket.on('message', ({ username: user, text, avatar, time }) => {
            const msgDiv = document.createElement('div');
            msgDiv.className = 'message';

            const avatarDiv = document.createElement('div');
            avatarDiv.className = 'avatar';
            avatarDiv.textContent = avatar || getAvatar(user.split('').reduce((a,c)=>a+c.charCodeAt(0),0));

            const contentDiv = document.createElement('div');
            contentDiv.className = 'message-content';

            const userDiv = document.createElement('span');
            userDiv.className = 'message-user';
            userDiv.textContent = user;

            const timeDiv = document.createElement('span');
            timeDiv.className = 'message-time';
            timeDiv.textContent = time || new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

            const textDiv = document.createElement('div');
            textDiv.className = 'message-text';
            textDiv.textContent = text;

            contentDiv.appendChild(userDiv);
            contentDiv.appendChild(timeDiv);
            contentDiv.appendChild(textDiv);

            msgDiv.appendChild(avatarDiv);
            msgDiv.appendChild(contentDiv);

            messagesElem.appendChild(msgDiv);
            messagesElem.scrollTop = messagesElem.scrollHeight;
        });

        // Keyboard focus on modal
        usernameInput.focus();

        // Responsive channel list
        window.addEventListener('resize', () => {
            if (window.innerWidth <= 800) {
                document.querySelector('.sidebar').style.display = 'none';
            } else {
                document.querySelector('.sidebar').style.display = '';
            }
        });
