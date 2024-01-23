from django.urls import path
from . import api

urlpatterns = [
    path('explain_sentence_ai/', api.explain_sentence_ai, name='explain_sentence_ai'),
]