from django.contrib import admin
from .models import (
    User,
    TypeMusic,
    Music,
    Favorite,
    Playlist,
    PlaylistMusic,
    ListenHistory
)


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "username",
        "email",
        "telegram_id",
        "stars",
        "listen_count",
        "created_at"
    )
    search_fields = (
        "username",
        "email",
        "telegram_id"
    )
    list_filter = (
        "created_at",
    )


@admin.register(TypeMusic)
class TypeMusicAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
    )
    search_fields = (
        "name",
    )


@admin.register(Music)
class MusicAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "title",
        "artist",
        "type_music",
        "created_at"
    )
    search_fields = (
        "title",
        "artist"
    )
    list_filter = (
        "type_music",
        "created_at"
    )


@admin.register(Favorite)
class FavoriteAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "music",
        "created_at"
    )
    search_fields = (
        "user__username",
        "music__title"
    )
    list_filter = (
        "created_at",
    )


@admin.register(Playlist)
class PlaylistAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
        "user",
        "created_at"
    )
    search_fields = (
        "name",
        "user__username"
    )
    list_filter = (
        "created_at",
    )


@admin.register(PlaylistMusic)
class PlaylistMusicAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "playlist",
        "music",
        "added_at"
    )
    search_fields = (
        "playlist__name",
        "music__title"
    )
    list_filter = (
        "added_at",
    )


@admin.register(ListenHistory)
class ListenHistoryAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "music",
        "listened_at"
    )
    search_fields = (
        "user__username",
        "music__title"
    )
    list_filter = (
        "listened_at",
    )