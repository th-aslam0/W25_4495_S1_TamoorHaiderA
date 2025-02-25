
from deepseek import views
from django.urls import path

urlpatterns = [
    path('', views.deepseek, name='deepseek'),
]
