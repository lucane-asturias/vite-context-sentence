from django.http import JsonResponse
from rest_framework.decorators import api_view

import base64
import requests

@api_view(['POST'])
def get_random_sentences(request):
    from_language = request.data.get('from')
    has_audio = request.data.get('has_audio')
    
    try:
        query_params = {
            'from': from_language,  # Language code
            'has_audio': has_audio,  # Filter for sentences with audio
            'limit': 10,            # Limit to 10 sentences
            'sort': 'random',       # Sort randomly
            'to': 'eng',            # Target language
            'trans_filter': 'limit',
            'trans_link': 'direct',
        }

        response = requests.get(
            'https://tatoeba.org/eng/api_v0/search',
            params=query_params,
        )

        response.raise_for_status()
        data = response.json()
        return JsonResponse({'data': data})
    except requests.RequestException as e:
        return JsonResponse({'error': f'Error fetching sentences: {str(e)}'}, status=500)


@api_view(['POST'])
def download_audio(request):
    audio_id = request.data.get('audio_id')
    if not audio_id:
        return JsonResponse({'error': 'Audio ID is required.'}, status=400)

    audio_url = f'https://tatoeba.org/en/audio/download/{audio_id}'

    try:
        # Fetch audio MP3 file
        audio_response = requests.get(audio_url)
        audio_response.raise_for_status()

        # Encode audio data as base64
        audio_data_base64 = base64.b64encode(audio_response.content).decode('utf-8')

        # Return audio file as base64-encoded string
        return JsonResponse({'audio_data': audio_data_base64})
    except requests.RequestException as e:
        return JsonResponse({'error': f'Error downloading audio: {str(e)}'}, status=500)
