import os
from dotenv import load_dotenv
from dashscope import Generation

# Load environment variables
load_dotenv()

# Get API key
api_key = os.getenv("DASHSCOPE_API_KEY")
if not api_key:
    print("Error: DASHSCOPE_API_KEY not found in .env")
    exit(1)

print(f"DASHSCOPE_API_KEY found: {api_key[:4]}...{api_key[-4:]}")

def test_generation():
    try:
        messages = [
            {'role': 'system', 'content': 'You are a helpful assistant.'},
            {'role': 'user', 'content': 'Hello, who are you?'}
        ]
        
        print("Sending request to qwen-turbo...")
        # Use qwen-turbo as a default test model
        response = Generation.call(
            model='qwen-turbo',
            messages=messages,
            api_key=api_key,
            result_format='message',  # set the result to be "message" format.
        )
        
        if response.status_code == 200:
            print("Success!")
            print("Response:", response.output.choices[0].message.content)
        else:
            print("Failed!")
            print("Status Code:", response.status_code)
            print("Code:", response.code)
            print("Message:", response.message)

    except Exception as e:
        print(f"An exception occurred: {e}")

if __name__ == "__main__":
    test_generation()
