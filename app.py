# app.py

from flask import Flask, render_template, request, jsonify, session
from questions import QUESTIONS

app = Flask(__name__)
app.secret_key = 'your_secret_key'  # Necessário para usar sessões em Flask

@app.route('/')
def home():
    session['current_question'] = 0  # Inicializa o índice da questão atual
    return render_template('index.html')

@app.route('/question')
def question():
    current_question = session.get('current_question', 0)
    if current_question < len(QUESTIONS):
        return jsonify(QUESTIONS[current_question])
    else:
        return jsonify({"end": True})  # Indica o fim do quiz

@app.route('/check_answer', methods=['POST'])
def check_answer():
    data = request.get_json()
    question_id = data['question_id']
    selected_answer = data['answer']

    if QUESTIONS[question_id]['answer'] == selected_answer:
        session['current_question'] += 1
        return jsonify({"correct": True})
    else:
        return jsonify({"correct": False})


if __name__ == '__main__':
    app.run(debug=True)


