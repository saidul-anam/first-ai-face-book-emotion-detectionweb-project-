
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Book
from transformers import pipeline
from rest_framework.response import Response
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from django.views import View
from django.http import JsonResponse
from django.conf import settings
import requests
from django.http import JsonResponse
from rest_framework.views import APIView
import requests
from django.conf import settings

class SpotifyTokenView(APIView):
    def post(self, request):
        # Logic to get Spotify token
        client_id = settings.SPOTIFY_CLIENT_ID
        client_secret = settings.SPOTIFY_CLIENT_SECRET
        # Use requests to get the token
        token_url = 'https://accounts.spotify.com/api/token'
        response = requests.post(token_url, {
            'grant_type': 'client_credentials',
            'client_id': client_id,
            'client_secret': client_secret,
        })
        return JsonResponse(response.json())

class SpotifySongSearchView(APIView):
    def post(self, request):
        emotion = request.data.get('emotion')
        print(emotion)
        access_token = request.data.get('access_token')

        # Add 'Bengali' to the search query to specifically look for Bengali songs
        search_url = 'https://api.spotify.com/v1/search'
        headers = {
            'Authorization': f'Bearer {access_token}',
        }
        query = f' Bengali {emotion} song'  # Adjust search to focus on Bengali songs
        response = requests.get(search_url, headers=headers, params={'q': query, 'type': 'track', 'limit': 1})
        
        data = response.json()
        if 'tracks' in data and len(data['tracks']['items']) > 0:
            # Extract first track
            track = data['tracks']['items'][0]
            song_data = {
                'song_name': track['name'],
                'artist': track['artists'][0]['name'],
                'preview_url': track['preview_url'],  # Preview URL (30 sec audio clip)
                'spotify_url': track['external_urls']['spotify']  # Link to Spotify song
            }
            return JsonResponse(song_data)
        else:
            return JsonResponse({'error': 'No Bengali songs found'}, status=404)

model_name = "bhadresh-savani/bert-base-go-emotion"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSequenceClassification.from_pretrained(model_name)
emotion_analyzer = pipeline("text-classification", model=model, tokenizer=tokenizer, return_all_scores=True)

@api_view(['GET'])
def book_list(request):
    books = Book.objects.all().values('id', 'title', 'author', 'description')
    return Response(books)

@api_view(['GET'])
def book_detail(request, book_id):
    try:
        book = Book.objects.get(id=book_id)
        return Response({
            'id': book.id,
            'title': book.title,
            'author': book.author,
            'description': book.description,
        })
    except Book.DoesNotExist:
        return Response({'error': 'Book not found'}, status=404)


@api_view(['POST'])
def analyze_emotion(request):
    text = request.data.get('text', '')
    if not text:
        return Response({"error": "No text provided"}, status=400)
    emotions = emotion_analyzer(text)
    print(emotions) 

    return Response(emotions)

