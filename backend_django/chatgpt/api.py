from django.http import JsonResponse
from rest_framework.decorators import api_view, authentication_classes, permission_classes

import openai

def request_openai(message):
    # system_message = f"You are a helpful language assistant who provides information and explains sentences in {language}."

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",  # Specify the OpenAI model to use
        messages=[
            {"role": "system", "content": "You are a helpful linguistic assistant that provides information and explanations about sentences."},
            {"role": "user", "content": message},
        ]
    )

    # Extract and clean the generated response
    print(' response.choices[0].message.content', response.choices[0].message.content)
    answer = response.choices[0].message.content.strip()
    return answer

@api_view(['POST'])
@authentication_classes([])
@permission_classes([])
def explain_sentence_ai(request):
    message = request.data.get('sentence')
    # language = request.data.get('language')

    if message:
        # Call the request_openai function to get the explanation
        explanation = request_openai(message)
        return JsonResponse({'explanation': explanation}, status=200)
    else:
        return JsonResponse({'error': 'Sentence required'}, status=400)