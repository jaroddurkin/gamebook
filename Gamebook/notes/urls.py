from django.urls import path
from . import views

urlpatterns = [
    path('new/', views.note_new, name='note_new'),
    path('', views.note_list, name='notes'),
    path('<int:note_id>/edit/', views.note_edit, name='note_edit'),
    path('<int:note_id>/', views.note_view, name='note_view'),
    path('delete/<int:note_id>/', views.note_delete, name='note_delete'),
]