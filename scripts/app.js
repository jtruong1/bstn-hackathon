let currentPrompt = getOriginalPrompt();
let responseCount = 0;

let formEl = document.getElementById('form');

formEl.addEventListener('submit', (e) => {
    e.preventDefault();

    let message = e.target.message.value;
    console.log(message);

    // After n responses, the prompt's context will reset to prevent the conversation from getting stuck in a loop.
    if (responseCount > 3) {
        currentPrompt = getOriginalPrompt();
    }

    // Append our message to the prompt.
    currentPrompt += message;

    let response = axios.post(
        'https://api.openai.com/v1/engines/text-davinci-001/completions',
        {
            // https://beta.openai.com/docs/api-reference/completions/create
            prompt: currentPrompt,
            temperature: 0.9,
            max_tokens: 150,
            top_p: 1,
            frequency_penalty: 1.0,
            presence_penalty: 0.6,
            stop: [" Human:", " AI:"]
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

        currentPrompt += response;
        currentPrompt += '\nHuman: ';

        console.log('Message: ' + message);
        console.log('Response: ' + response);
        console.log('Prompt: ' + currentPrompt);

        let responsesEl = document.getElementById('responses');

        let responseEl = document.createElement('p');
        responseEl.innerText = response;

        responsesEl.appendChild(responseEl);
    }).catch(error => {
        console.log(error);
    });
});

function getOriginalPrompt() {
    return 'The following is a conversation with an AI assistant named "V" that provides dating and relationship advice. The assistant is helpful, understanding, and very friendly. Today is Valentine\'s day\n\nV: How can I help you today?\nHuman: ';
}
