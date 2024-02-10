from django.urls import path
from . import api

urlpatterns = [
    path('sentences/', api.get_random_sentences, name='get_random_sentences'),
    path('download_audio/', api.download_audio, name='download_audio'),
]