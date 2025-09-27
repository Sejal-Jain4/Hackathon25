import requests
import json
import sys

def test_api_endpoint():
    """Test the /api/ai/chat endpoint directly"""
    print("Testing /api/ai/chat endpoint...")
    
    url = "http://localhost:5000/api/ai/chat"
    headers = {"Content-Type": "application/json"}
    data = {
        "message": "Hello, can you help me with my finances?",
        "userId": "test_user",
        "profile": {
            "income": {"amount": 1000, "frequency": "monthly"},
            "questionnaire": {
                "lifeStage": "College Student",
                "incomeType": "Part-time",
                "financialPriority": "budget"
            },
            "savingsGoal": {
                "name": "Emergency Fund",
                "target": 5000,
                "current": 1000
            },
            "expenses": [
                {"category": "Rent", "amount": 500},
                {"category": "Food", "amount": 200}
            ]
        }
    }
    
    try:
        print("Sending request to:", url)
        print(f"Request data: {json.dumps(data, indent=2)}")
        response = requests.post(url, json=data, headers=headers)
        
        print(f"\nStatus Code: {response.status_code}")
        print(f"Response Time: {response.elapsed.total_seconds()}s")
        
        if response.status_code == 200:
            print(f"\nResponse JSON: {json.dumps(response.json(), indent=2)}")
            return True
        else:
            print(f"\nError Response: {response.text}")
            return False
    except Exception as e:
        print(f"Exception occurred: {str(e)}")
        return False

if __name__ == "__main__":
    success = test_api_endpoint()
    sys.exit(0 if success else 1)