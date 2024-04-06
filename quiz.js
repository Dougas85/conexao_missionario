let currentQuestionIndex = 0;
let score = 0;
const isMock = window.location.hostname.includes('github.io');
let questions = [];

document.addEventListener('DOMContentLoaded', () => {
    loadQuestions();
});

function loadQuestions() {
    if(isMock) {
        // Carrega perguntas de um array mockado se estiver no GitHub Pages
        questions = [
    { id: 1, question: "Qual é a capital da França?", options: ["Paris", "Londres", "Berlim"], correct: "Paris" },
    { id: 2, question: "Qual é o maior planeta do sistema solar?", options: ["Marte", "Júpiter", "Saturno"], correct: "Júpiter" },
    { id: 3, question: "Qual discípulo andou sobre as águas?", options: ["João", "Tiago", "Pedro", "Judas"], correct: "Pedro" },
    { id: 4, question: "Quem foi o rei  mais jovem a reinar em Jerusalém?", options: ["Salomão", "Joás", "Josias", "Acaz"], correct: "Joás" },
    { id: 5, question" "Qual é a capital de Roraima?" ["Porto Velho", "Rio Branco", "Boa Vista", "São Luiz" ], correct: "Boa Vista" },
            // Adicione mais perguntas conforme necessário
        ];
        displayQuestion();
    } else {
        // Busca perguntas do servidor se não estiver no GitHub Pages
        fetch('/question')
        .then(response => response.json())
        .then(data => {
            questions = data;
            displayQuestion();
        })
        .catch(error => console.error('Erro ao buscar perguntas:', error));
    }
}

function displayQuestion() {
    const question = questions[currentQuestionIndex];
    if(!question) {
        showResults();
        return;
    }
    const container = document.getElementById('question-container');
    container.innerHTML = `
        <legend>${question.question}</legend>
        ${question.options.map((option, index) => `
            <div>
                <input type="radio" name="answer" id="option${index}" value="${option}">
                <label for="option${index}">${option}</label>
            </div>
        `).join('')}
        <button onclick="submitAnswer()">Submeter Resposta</button>
    `;
}

function submitAnswer() {
    const selectedOption = document.querySelector('input[name="answer"]:checked')?.value;
    if (!selectedOption) {
        alert('Por favor, selecione uma opção.');
        return;
    }

    if (isMock) {
        // Verifica a resposta diretamente se estiver usando dados mockados
        const question = questions[currentQuestionIndex];
        if(selectedOption === question.correct) {
            score++;
            alert('Correto!');
        } else {
            alert('Incorreto.');
        }
        currentQuestionIndex++;
        displayQuestion();
    } else {
        // Envie a resposta para o servidor para verificação
        fetch('/check_answer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ answer: selectedOption, question_id: questions[currentQuestionIndex].id }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.correct) {
                score++;
                alert('Correto!');
            } else {
                alert('Incorreto.');
            }
            currentQuestionIndex++;
            displayQuestion();
        })
        .catch(error => console.error('Erro ao submeter resposta:', error));
    }
}

function showResults() {
    const container = document.getElementById('question-container');
    container.innerHTML = `<p>Seu score é ${score} de ${questions.length}.</p>`;
}
