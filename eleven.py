from dotenv import load_dotenv
from elevenlabs.client import ElevenLabs
import os

load_dotenv()

# The API key should be provided directly or from environment variable
elevenlabs = ElevenLabs(
  api_key="sk_5367b1502792e26d0278dac0f35e9729e52ac804ca452e2a",
)

audio = elevenlabs.text_to_speech.convert(
    text="The first move is what sets everything in motion.",
    voice_id="JBFqnCBsd6RMkjVDRZzb",
    model_id="eleven_multilingual_v2",
    output_format="mp3_44100_128",
)

# Save the audio to a file
with open("test_audio.mp3", "wb") as f:
    for chunk in audio:
        f.write(chunk)

print("Audio saved to test_audio.mp3")