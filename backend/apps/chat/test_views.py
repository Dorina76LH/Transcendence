from django.http import HttpResponse

def chat_test_page(request):
    html = """
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Test WebSocket Chat</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 700px;
            margin: 40px auto;
        }

        input, button {
            padding: 8px;
            margin: 4px 0;
            width: 100%;
        }

        #messages {
            border: 1px solid #ccc;
            padding: 10px;
            height: 300px;
            overflow-y: auto;
            margin-top: 15px;
        }

        .message {
            padding: 6px;
            border-bottom: 1px solid #eee;
        }
    </style>
</head>
<body>
    <h1>Test WebSocket Chat</h1>

    <p>Utilisateur connecté via la session Django.</p>

    <label>Conversation ID</label>
    <input id="conversationId" type="number" placeholder="Exemple: 1">

    <button onclick="connectSocket()">Connecter WebSocket</button>

    <label>Message</label>
    <input id="messageInput" type="text" placeholder="Écrire un message">

    <button onclick="sendMessage()">Envoyer</button>

    <button onclick="disconnectSocket()">Déconnecter</button>

    <div id="messages"></div>

    <script>
        let socket = null;

        function addMessage(text) {
            const messages = document.getElementById('messages');
            const div = document.createElement('div');

            div.className = 'message';
            div.textContent = text;

            messages.appendChild(div);
            messages.scrollTop = messages.scrollHeight;
        }

        function connectSocket() {
            const conversationId = document.getElementById('conversationId').value;

            if (!conversationId) {
                addMessage('Erreur: il faut mettre un conversation_id.');
                return;
            }

            if (socket) {
                socket.close();
            }

            socket = new WebSocket(
                `ws://localhost:8000/ws/chat/conversations/${conversationId}/`
            );

            socket.onopen = function () {
                addMessage('WebSocket connecté à la conversation ' + conversationId);
            };

            socket.onmessage = function (event) {
                const data = JSON.parse(event.data);

                addMessage(
                    data.username + ': ' + data.message + ' (' + data.created_at + ')'
                );
            };

            socket.onerror = function () {
                addMessage('Erreur WebSocket.');
            };

            socket.onclose = function (event) {
                addMessage(
                    'WebSocket fermé. Code: ' + event.code +
                    ' | Clean: ' + event.wasClean
                );
            };
        }

        function sendMessage() {
            const input = document.getElementById('messageInput');
            const message = input.value.trim();

            if (!socket || socket.readyState !== WebSocket.OPEN) {
                addMessage('Erreur: WebSocket non connecté.');
                return;
            }

            if (!message) {
                addMessage('Erreur: message vide.');
                return;
            }

            socket.send(JSON.stringify({
                message: message
            }));

            input.value = '';
        }

        function disconnectSocket() {
            if (socket) {
                socket.close();
                socket = null;
            }
        }
    </script>
</body>
</html>
"""
    return HttpResponse(html)