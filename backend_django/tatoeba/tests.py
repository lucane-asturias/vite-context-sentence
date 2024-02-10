import json

from django.test import TestCase
from rest_framework.test import APIClient
from django.urls import reverse

class TatoebaApiTest(TestCase):

    @classmethod
    def setUpTestData(cls):
        cls.client = APIClient()


    # def test_tatoeba(self):
    #     # Perform a GET request to the 'api_dictio' view
    #     response = self.client.get(reverse('get_random_sentences'))

    #     # # Assert that the status code is 200 (OK)
    #     # self.assertEqual(response.status_code, 200)

    #     # Print the JSON response directly
    #     print('response', response.json())


    def test_download_audio(self):
        # Mock audio ID for testing
        audio_id = 178159

        # Perform a POST request to the 'download_audio' view
        response = self.client.post(reverse('download_audio'), data={'audio_id': audio_id})

        print('response', response.json())

        # Assert that the status code is 200 (OK)
        self.assertEqual(response.status_code, 200)