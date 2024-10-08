from django.urls import path
from .views import book_list, book_detail
from .views import analyze_emotion
from .views import SpotifyTokenView, SpotifySongSearchView
urlpatterns = [
    path('api/books/', book_list),
    path('api/books/<int:book_id>/', book_detail),  # URL for fetching a single book
    path('analyze-emotion/', analyze_emotion, name='analyze_emotion'),
     path('get-spotify-token/', SpotifyTokenView.as_view(), name='get_spotify_token'),
    path('search-songs/', SpotifySongSearchView.as_view(), name='search_songs')
]