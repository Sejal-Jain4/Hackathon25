import * as Speech from 'expo-speech';

// This is a placeholder service for the AI voice interactions
// In a real app, this would integrate with Azure Speech Services for STT/TTS
// and Azure OpenAI for the AI model

export interface AIResponse {
  text: string;
  responseType: 'advice' | 'insight' | 'celebration' | 'general';
}

export const VoiceService = {
  // Placeholder for Speech-to-Text
  startListening: async (): Promise<string> => {
    // In a real app, this would use Azure Speech Services STT
    // For now, we'll simulate voice recognition with a promise
    return new Promise((resolve) => {
      // Simulate processing time
      setTimeout(() => {
        // Return a simulated recognized text
        resolve("Can I afford to buy a $20 hoodie?");
      }, 2000);
    });
  },

  // Placeholder for Text-to-Speech
  speak: async (text: string): Promise<void> => {
    // For demo purposes, we'll use Expo's Speech module
    return Speech.speak(text, {
      language: 'en',
      pitch: 1.0,
      rate: 0.9,
    });
  },

  stopSpeaking: () => {
    Speech.stop();
  }
};

export const AICoachService = {
  // Placeholder for sending message to AI coach
  sendMessage: async (message: string): Promise<AIResponse> => {
    // In a real app, this would call Azure OpenAI with function calling
    // For the hackathon, we'll simulate responses
    const mockResponses: AIResponse[] = [
      {
        text: "Based on your current budget and savings, you can afford that $20 hoodie. But remember your goal to save for Spring Break!",
        responseType: 'advice',
      },
      {
        text: "Your food spending is up 40% this month compared to last month. Would you like me to help you find ways to cut back?",
        responseType: 'insight',
      },
      {
        text: "Great job on your 5-day streak! You've earned the 'Consistency King' badge!",
        responseType: 'celebration',
      },
      {
        text: "I've detected a $9.99 subscription you haven't used in 3 months. Would you like me to help you cancel it?",
        responseType: 'insight',
      },
    ];
    
    // Simulate API call delay
    return new Promise((resolve) => {
      setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * mockResponses.length);
        resolve(mockResponses[randomIndex]);
      }, 1500);
    });
  },

  // Function to simulate the affordability check
  checkAffordability: async (
    item: string,
    amount: number
  ): Promise<{ canAfford: boolean; reason: string }> => {
    // In a real app, this would analyze the user's budget and finances
    // For the hackathon, we'll simulate a response
    return new Promise((resolve) => {
      setTimeout(() => {
        // Randomly determine if user can afford the item
        const canAfford = Math.random() > 0.3;
        
        const reason = canAfford
          ? "Your current budget has enough room for this purchase."
          : "This would exceed your discretionary spending budget for the month.";
          
        resolve({ canAfford, reason });
      }, 1000);
    });
  },

  // Function to get AI-powered financial insights
  getInsights: async (): Promise<AIResponse[]> => {
    // In a real app, this would analyze the user's transaction history
    // For the hackathon, we'll simulate insights
    const mockInsights: AIResponse[] = [
      {
        text: "Your food spending is up 40% this month compared to last month.",
        responseType: 'insight',
      },
      {
        text: "You've been consistent with saving toward your emergency fund goal. Great job!",
        responseType: 'celebration',
      },
      {
        text: "I've detected a $9.99 subscription you haven't used in 3 months.",
        responseType: 'insight',
      },
    ];
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockInsights);
      }, 1000);
    });
  },
};