from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet
from .serializers import UserSerializer, MusicSerializer, TypeMusicSerializer, PlaylistMusicSerializer, PlaylistSerializer, ListenHistorySerializer, FavoriteSerializer
from  main.models import User, Music, TypeMusic, Favorite, ListenHistory, PlaylistMusic, Playlist

from .paginations import StandardResultsSetPagination

class UserViewSet(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    pagination_class = StandardResultsSetPagination

class TypeMusicViewSet(ModelViewSet):
    queryset = TypeMusic.objects.all()
    serializer_class = TypeMusicSerializer
    pagination_class = StandardResultsSetPagination


class MusicViewSet(ModelViewSet):
    queryset = Music.objects.all()
    serializer_class = MusicSerializer
    pagination_class = StandardResultsSetPagination


class PlaylistMusicViewSet(ModelViewSet):
    queryset = PlaylistMusic.objects.all()
    serializer_class = PlaylistMusicSerializer
    pagination_class = StandardResultsSetPagination

class PlaylistViewSet(ModelViewSet):
    queryset = Playlist.objects.all()
    serializer_class = PlaylistSerializer
    pagination_class = StandardResultsSetPagination


class ListenHistoryViewSet(ModelViewSet):
    queryset = ListenHistory.objects.all()
    serializer_class = ListenHistorySerializer
    pagination_class = StandardResultsSetPagination


class FavoriteViewSet(ModelViewSet):
    queryset = Favorite.objects.all()
    serializer_class = FavoriteSerializer
    pagination_class = StandardResultsSetPagination
