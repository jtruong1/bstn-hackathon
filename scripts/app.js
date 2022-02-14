let formEl = document.getElementById('form');

formEl.addEventListener('submit', (e) => {
    e.preventDefault();

    let reponse = axios.post(
        'https://api.openai.com/v1/engines/text-davinci-001/completions',
        {
            prompt: "The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly.\n\nHuman: " + e.target.prompt.value,
            temperature: 0.9,
            max_tokens: 150,
            top_p: 1,
            frequency_penalty: 0,
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

    reponse.then(response => {
        console.log(response.data);
    }).catch(error => {
        console.log(error);
    });
});
