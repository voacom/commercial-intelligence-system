import os
import re
import sys
from dotenv import load_dotenv
from dashscope import Generation

# Load environment variables
load_dotenv()

def generate_ppt_code():
    api_key = os.getenv("DASHSCOPE_API_KEY")
    if not api_key:
        print("Error: DASHSCOPE_API_KEY not found in .env")
        return None

    prompt = """
    Please write a complete Python script using the `python-pptx` library to create a PowerPoint presentation.
    Topic: 'Commercial Banking Intelligence 2024'
    Requirements:
    1. A Title Slide with the title 'Commercial Banking Intelligence' and subtitle 'AI-Driven Future'.
    2. Slide 1: 'Market Trends' (3 bullet points).
    3. Slide 2: 'Core Technologies' (3 bullet points like NLP, Predictive Analytics, etc.).
    4. Slide 3: 'Strategic Benefits' (3 bullet points).
    5. The script must save the presentation to a file named 'commercial_banking_ai.pptx'.
    6. Ensure the code is self-contained and runnable.
    7. Do not use any external images or resources that need to be downloaded.
    8. **IMPORTANT**: Make sure to import `Pt` from `pptx.util` if you set font sizes (e.g., `from pptx.util import Pt`). Use `Pt(14)` not `pt(14)`.
    
    IMPORTANT: Provide ONLY the Python code. Do not wrap it in markdown code blocks (```python ... ```). Just the code.
    """

    print("Requesting PPT generation code from DashScope (qwen-turbo)...")
    try:
        response = Generation.call(
            model='qwen-turbo',
            messages=[{'role': 'user', 'content': prompt}],
            api_key=api_key,
            result_format='message'
        )

        if response.status_code == 200:
            content = response.output.choices[0].message.content
            # Clean up markdown code blocks if present (just in case)
            clean_code = re.sub(r'^```python\s*', '', content)
            clean_code = re.sub(r'^```\s*', '', clean_code)
            clean_code = re.sub(r'```$', '', clean_code)
            return clean_code.strip()
        else:
            print(f"Failed to generate code: {response.code} - {response.message}")
            return None

    except Exception as e:
        print(f"Exception during generation: {e}")
        return None

def main():
    print("--- Testing DashScope PPT Generation Capability ---")
    
    # Step 1: Generate Code
    code = generate_ppt_code()
    if not code:
        print("Failed to generate code.")
        return

    print("\n--- Generated Python Code ---")
    print(code)
    print("-----------------------------\n")

    # Step 2: Execute Code
    print("Executing generated code...")
    try:
        # Create a temporary file for the generated code
        with open("generated_ppt_script.py", "w", encoding="utf-8") as f:
            f.write(code)
        
        # Execute the file
        # Use the current python interpreter to ensure dependencies are found
        os.system(f'"{sys.executable}" generated_ppt_script.py')
        
        # Check if file exists
        if os.path.exists("commercial_banking_ai.pptx"):
            print("\nSUCCESS: 'commercial_banking_ai.pptx' has been created successfully!")
        else:
            print("\nFAILURE: The script ran but the PPT file was not found.")
            
    except Exception as e:
        print(f"Error executing code: {e}")

if __name__ == "__main__":
    main()
