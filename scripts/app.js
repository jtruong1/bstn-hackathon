let currentPrompt = getInitialPrompt();
let responseCount = 0;

let formEl = document.querySelector('.ask__form');

formEl.addEventListener('submit', (e) => {
    e.preventDefault();

    let message = e.target.message.value;
    message = message.trim();
    console.log(message);

    // After n responses, the prompt's context will reset to prevent the conversation from getting stuck in a loop.
    if (responseCount > 3) {
        // currentPrompt = getInitialPrompt();
    }

    // Append our message to the prompt.
    currentPrompt += '\nHuman: ' + message + '\nV: ';

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

        console.log('Message: ' + message);
        console.log('Response: ' + response);
        console.log('Prompt: ' + currentPrompt);

        // User message
        let userMessageContainerEl = document.createElement('div');
        userMessageContainerEl.classList.add('ask__right');

        let userMessageEl = document.createElement('p');
        userMessageEl.classList.add('ask__question');
        userMessageEl.innerText = message;

        let userIconEl = document.createElement('img');
        userIconEl.classList.add('ask__question-icon');
        userIconEl.setAttribute('src', '/assets/images/chat-icon-profile2.svg');

        userMessageContainerEl.appendChild(userMessageEl);
        userMessageContainerEl.appendChild(userIconEl);

        // AI message
        let aiMessageContainerEl = document.createElement('div');
        aiMessageContainerEl.classList.add('ask__left');

        let aiMessageEl = document.createElement('p');
        aiMessageEl.classList.add('ask__answer');
        aiMessageEl.innerText = response;

        let vIconEl = document.createElement('img');
        vIconEl.classList.add('ask__answer-icon');
        vIconEl.setAttribute('src', '/assets/images/chat-icon-v.svg');

        aiMessageContainerEl.appendChild(vIconEl);
        aiMessageContainerEl.appendChild(aiMessageEl);

        let responsesEl = document.getElementById('responses');
        responsesEl.appendChild(userMessageContainerEl);
        responsesEl.appendChild(aiMessageContainerEl);

        responseCount++;
    }).catch(error => {
        console.log(error);

        responseCount = 0;
    });
});

function getInitialPrompt() {
    return 'The following is a conversation with an AI assistant named V. '
        + 'The assistant is helpful, understanding, and very friendly. '
        + 'Today is Valentine\'s day.\n\n'
        + 'Human: Hello, who are you?\n'
        + 'V: I am V, an AI that can help you with anything dating and relationship related. How can I help you?';
}
