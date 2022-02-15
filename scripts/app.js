let currentPrompt = getInitialPrompt();

let messagesEl = document.querySelector('.ask__messages');

messagesEl.addEventListener('reply', (e) => {
    displayAiMessage(e.detail);

    // We can put timeout/delay logic here so we can do typing indicators, animations, etc.
});

let formEl = document.querySelector('.ask__form');

formEl.addEventListener('submit', (e) => {
    e.preventDefault();

    let message = e.target.message.value;
    message = message.trim();
    // console.log(message);

    e.target.message.value = '';

    if (message.length === 0) {
        return;
    }

    // After n responses, the prompt's context will reset to prevent the conversation from getting stuck in a loop.
    /*if (responseCount > 3) {
        currentPrompt = getInitialPrompt();
    }*/

    // Append our message to the prompt.
    currentPrompt += '\nHuman: ' + message + '\nV: ';

    // Display our message first before waiting for the AI's response.
    displayUserMessage(message);

    let response = axios.post(
        'https://api.openai.com/v1/engines/text-davinci-001/completions',
        {
            // https://beta.openai.com/docs/api-reference/completions/create
            prompt: currentPrompt,
            temperature: 0.9,
            max_tokens: 150,
            top_p: 1,
            frequency_penalty: 2.0,
            presence_penalty: 0.6,
            stop: [" Human:", " V:"]
        },
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + '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'
            }
        },
    );

    response.then(result => {
        let response = result.data.choices[0].text;
        response = response.trim();

        // Append the AI's response.
        currentPrompt += response;

        console.log(result.data);
        // console.log('Message: ' + message);
        console.log('Response: ' + response);
        console.log('Prompt: ' + currentPrompt);

        // Dispatch a custom event called 'reply' to process AI messages.
        messagesEl.dispatchEvent(
            new CustomEvent('reply', {detail: response})
        );
    }).catch(error => {
        console.log(error);
    });
});

let messageEl = document.getElementById('askInput');

messageEl.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        // Prevent making a new line.
        e.preventDefault();

        // Manually fire the submit event to the form.
        e.target.form.dispatchEvent(
            new Event('submit', {cancelable: true})
        );
    }
});

function getInitialPrompt() {
    return 'The following is a conversation with an AI assistant named V. '
        + 'The assistant is helpful, understanding, and very friendly. '
        + 'Today is Valentine\'s day.\n\n'
        + 'Human: Hello, who are you?\n'
        + 'V: I am V, an AI that can help you with anything related to dating and relationships. How can I help you?';
}

function displayUserMessage(message) {
    let userMessageContainerEl = document.createElement('div');
    userMessageContainerEl.classList.add('ask__right');

    let userMessageEl = document.createElement('p');
    userMessageEl.classList.add('ask__question');
    userMessageEl.innerText = message;

    let userAvatarEl = document.createElement('img');
    userAvatarEl.classList.add('ask__question-icon');
    userAvatarEl.setAttribute('src', '/assets/images/chat-icon-profile2.svg');

    userMessageContainerEl.appendChild(userMessageEl);
    userMessageContainerEl.appendChild(userAvatarEl);

    messagesEl.appendChild(userMessageContainerEl);
}

function displayAiMessage(message) {
    let aiMessageContainerEl = document.createElement('div');
    aiMessageContainerEl.classList.add('ask__left');

    let aiMessageEl = document.createElement('p');
    aiMessageEl.classList.add('ask__answer');
    aiMessageEl.innerText = message;

    let aiAvatarEl = document.createElement('img');
    aiAvatarEl.classList.add('ask__answer-icon');
    aiAvatarEl.setAttribute('src', '/assets/images/chat-icon-v.svg');

    aiMessageContainerEl.appendChild(aiMessageEl);
    aiMessageContainerEl.appendChild(aiAvatarEl);

    messagesEl.appendChild(aiMessageContainerEl);
}
