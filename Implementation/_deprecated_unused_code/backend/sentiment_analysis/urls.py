
from sentiment_analysis import views
from django.urls import path

urlpatterns = [
    path('', views.sentiment, name='sentiment'),
]
