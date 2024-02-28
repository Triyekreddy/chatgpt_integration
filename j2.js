 const chatLog = document.getElementById('chat-log');
        const userInput = document.getElementById('user-input');
        const API_KEY = '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';

        async function sendMessage() {
            const userMessage = userInput.value.trim();
            if (userMessage === '') return;

            appendMessage('user', userMessage);
            await getBotResponse([{ role: 'user', content: userMessage }]);
            userInput.value = '';
        }

        function appendMessage(sender, message) {
            const messageContainer = document.createElement('div');
            messageContainer.classList.add('message-container');

            const messageDiv = document.createElement('div');
            messageDiv.classList.add(sender + '-message');

            const hasCodeBlock = message.includes("<pre><code class=\"code-green\">");
            if (hasCodeBlock) {
                message = message.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/&/, '&amp;').replace(/'/, '&#039;');
                const codeContent = message.replace(/([\s\S]+?)/g, '</p><pre><code class="code-green">$1</code></pre><p>');
                messageDiv.innerHTML = codeContent;
            } else {
                messageDiv.textContent = message;
            }

            messageContainer.appendChild(messageDiv);
            chatLog.appendChild(messageContainer);
            chatLog.scrollTop = chatLog.scrollHeight;
        }

        async function getBotResponse(userMessages) {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + API_KEY,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ model: 'gpt-3.5-turbo', messages: userMessages })
            });

            if (!response.ok) {
                console.error('Error:', response.status);
                return;
            }

            const responseData = await response.json();
            console.log(responseData);

            if (responseData.choices && responseData.choices.length > 0) {
                const botMessage = responseData.choices[0].message.content;
                appendMessage('bot', botMessage);
                console.log(botMessage);
            } else {
                console.error("No response from the bot");
            }
        }
        document.querySelector(".chat-container").addEventListener("submit", (event) => {
            event.preventDefault();
            document.querySelector("#user-input").value = "";
        });