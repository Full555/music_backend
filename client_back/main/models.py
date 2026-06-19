from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    telegram_id = models.BigIntegerField(
        unique=True,
        null=True,
        blank=True
    )

    avatar = models.ImageField(
        upload_to="avatars/",
        blank=True,
        null=True
    )

    stars = models.PositiveIntegerField(
        default=0
    )

    listen_count = models.PositiveIntegerField(
        default=0
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return self.username

    class Meta:
        verbose_name = "Пользователь"
        verbose_name_plural = "Пользователи"


class TypeMusic(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Жанр"
        verbose_name_plural = "Жанры"


class Music(models.Model):
    image = models.ImageField(
        upload_to="musics/"
    )

    title = models.CharField(max_length=255)

    artist = models.CharField(max_length=255)

    music = models.FileField(
        upload_to="musics/"
    )

    type_music = models.ForeignKey(
        TypeMusic,
        on_delete=models.CASCADE,
        related_name="musics"
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = "Музыка"
        verbose_name_plural = "Музыка"


class Favorite(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="favorites"
    )

    music = models.ForeignKey(
        Music,
        on_delete=models.CASCADE
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        verbose_name = "Избранное"
        verbose_name_plural = "Избранное"
        unique_together = ("user", "music")


class Playlist(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="playlists"
    )

    name = models.CharField(max_length=255)

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Плейлист"
        verbose_name_plural = "Плейлисты"


class PlaylistMusic(models.Model):
    playlist = models.ForeignKey(
        Playlist,
        on_delete=models.CASCADE,
        related_name="tracks"
    )

    music = models.ForeignKey(
        Music,
        on_delete=models.CASCADE
    )

    added_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        verbose_name = "Музыка в плейлисте"
        verbose_name_plural = "Музыка в плейлистах"


class ListenHistory(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    music = models.ForeignKey(
        Music,
        on_delete=models.CASCADE
    )

    listened_at = models.DateTimeField(
        auto_now_add=True
    )


    class Meta:
        verbose_name = "История прослушивания"
        verbose_name_plural = "История прослушиваний"


