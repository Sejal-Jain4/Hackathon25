"""
Simple test script for OpenAI Azure connection using the 'openai' package version 0.28.0
"""
import os
import openai
from dotenv import load_dotenv

# Print OpenAI version
print(f"Using OpenAI SDK version: {openai.__version__}")
if openai.__version__ != "0.28.0":
    print("⚠️ Warning: This script is designed for openai==0.28.0")

# Load environment variables
load_dotenv()

def test_azure_openai():
    print("Testing Azure OpenAI connection...")
    
    # Get credentials from .env
    azure_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
    azure_key = os.getenv("AZURE_OPENAI_KEY")
    deployment_name = os.getenv("AZURE_OPENAI_DEPLOYMENT")
    
    # Check if credentials are available
    print(f"Azure OpenAI Endpoint: {'✓ Set' if azure_endpoint else '✗ Not set'}")
    print(f"Azure OpenAI Key: {'✓ Set' if azure_key else '✗ Not set'}")
    print(f"Deployment Name: {'✓ Set' if deployment_name else '✗ Not set'}")
    
    if not azure_endpoint or not azure_key or not deployment_name:
        print("Error: Missing Azure OpenAI credentials. Please check your .env file.")
        return
    
    try:
        # Configure OpenAI for Azure (v0.28.0 SDK style)
        openai.api_type = "azure"
        openai.api_key = azure_key
        openai.api_base = azure_endpoint
        openai.api_version = "2023-05-15"  # Using a compatible version with v0.28.0
        
        # Test with a simple completion
        print(f"\nSending test message to {deployment_name}...")
        response = openai.ChatCompletion.create(
            engine=deployment_name,
            messages=[
                {"role": "system", "content": "You are a helpful financial assistant called Centsi."},
                {"role": "user", "content": "Hello! Can you hear me? Please respond with a short greeting."}
            ],
            max_tokens=50
        )
        
        # Print the result
        message = response['choices'][0]['message']['content']
        print("\n✓ Success! Received response:")
        print("------------------------------")
        print(message)
        print("------------------------------")
        print("\nYour Azure OpenAI connection is working correctly!")
        
    except Exception as e:
        print("\n✗ Error connecting to Azure OpenAI:")
        print(f"{e}")
        print("\nTroubleshooting tips:")
        print("1. Check if your API key and endpoint are correct")
        print("2. Verify that your deployment name is correct")
        print("3. Make sure your API version (2025-04-14) is supported")
        print("4. Check network connectivity to Azure")

if __name__ == "__main__":
    test_azure_openai()