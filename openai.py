import openai

openai.api_key = "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"

def chat_with_gpt(prompt):
    # Send the input to OpenAI and retrieve the model's response
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}]
    )

    return response.choices[0].message.content.strip()

if __name__ == "__main__":
    while True:
        user_input = input("You: ")
        if user_input.lower() in ["quit", "exit", "bye"]:
            break
        
        # Get the chatbot's response and display it
        response = chat_with_gpt(user_input)
        print("Chatbot:", response)
