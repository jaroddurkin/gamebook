from django.db import models
from users.models import CustomUser


class Note(models.Model):
    author = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True)
    title = models.CharField(max_length=100, default="Untitled Note", null=True)
    content = models.TextField(null=True)
    date_created = models.DateTimeField(auto_now_add=True)
    last_edited = models.DateTimeField(auto_now=True)
    is_deleted = models.BooleanField(default=False)

    def __str__(self):
        return str(self.id) + " " + self.title




