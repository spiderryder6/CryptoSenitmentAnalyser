from openai import OpenAI


class LLMChatManager:
    def __init__(self, api_key=None, base_url=None, model=None):
        if not api_key:
            raise ValueError("API key must be provided.")
        if not base_url:
            raise ValueError("Base URL must be provided.")
        if not model:
            raise ValueError("Model must be provided.")
        self.client = OpenAI(api_key=api_key, base_url=base_url)
        self.model = model

    def chat(self, message):
        response = self.client.chat.completions.create(
            model=self.model,
            messages=[{"role": "user", "content": message}],
            stream=False,
        )
        return response.choices[0].message.content

    def chat_with_multiple_messages(self, messages):
        assert len(messages) > 0
        response = self.client.chat.completions.create(
            model=self.model,
            messages=[{"role": "user", "content": message} for message in messages],
            stream=False,
        )
        return response.choices[0].message.content
