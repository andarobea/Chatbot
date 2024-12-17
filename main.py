from flask import Flask, request, jsonify
from chatterbot import ChatBot
from chatterbot.trainers import ChatterBotCorpusTrainer, ListTrainer

# Initialize Flask app
app = Flask(__name__)

# Initialize chatbot
chatbot = ChatBot('Sam')

# Train chatbot with English corpus
corpus_trainer = ChatterBotCorpusTrainer(chatbot)
corpus_trainer.train("chatterbot.corpus.english")

# Train chatbot with custom list
list_trainer = ListTrainer(chatbot)
list_trainer.train([
    'How are you?',
    'I am good.',
    'That is good to hear.',
    'Thank you',
    'You are welcome.',
])

@app.route('/chat', methods=['POST'])
def chat():
    """Endpoint to handle chat messages."""
    data = request.get_json()
    user_message = data.get('message', '')

    # Get response from chatbot
    response = chatbot.get_response(user_message)

    return jsonify({"response": str(response)})

if __name__ == '__main__':
    app.run(debug=True)

# example of chatbot implemented with the chatterbot library