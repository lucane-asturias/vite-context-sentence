from django.http import JsonResponse
from rest_framework.decorators import api_view
import requests

@api_view(['POST'])
def get_random_sentences(request):
    from_language = request.data.get('from')
    
    try:
        query_params = {
            'trans_filter': 'limit',
            'trans_link': 'direct',
            'from': from_language,  # Language code
            'to': 'eng',            # Target language
            'sort': 'random',       # Sort randomly
            'limit': 10,            # Limit to 10 sentences
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