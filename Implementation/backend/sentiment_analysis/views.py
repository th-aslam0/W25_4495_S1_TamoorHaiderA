from django.shortcuts import render
from django.http import HttpResponse
import os
import sys
import pandas as pd
import string
import nltk
from nltk.tokenize import TweetTokenizer
from nltk.corpus import stopwords
from nltk.sentiment import SentimentIntensityAnalyzer
import warnings

warnings.filterwarnings('ignore')

# Download necessary NLTK data
nltk.download('stopwords')
nltk.download('vader_lexicon')

# Set up sentiment analysis tools
tweet_tokenizer = TweetTokenizer()
sia = SentimentIntensityAnalyzer()

# Path to preprocessing module
preprocessing_dir = "/home/etherealenvy/Downloads/practical-nlp/Ch8"
sys.path.append(preprocessing_dir)

try:
    import O5_smtd_preprocessing
except ImportError:
    O5_smtd_preprocessing = None


def preprocess_review_with_custom_processing(review):
    if O5_smtd_preprocessing:
        processed_text = O5_smtd_preprocessing.process_TweetText(review)
    else:
        processed_text = review  # Fallback if module isn't found

    # Tokenize and remove punctuation
    tokens = tweet_tokenizer.tokenize(processed_text)
    tokens = [word for word in tokens if word not in string.punctuation]

    # Remove stopwords
    tokens = [word for word in tokens if word.lower() not in stopwords.words('english')]

    return " ".join(tokens)


def get_vader_sentiment(text):
    score = sia.polarity_scores(text)
    if score['compound'] >= 0.05:
        return "Positive"
    elif score['compound'] <= -0.05:
        return "Negative"
    else:
        return "Neutral"


def sentiment(request):
    result = None  # Default value

    if request.method == "POST":
        user_review = request.POST.get("review", "")

        if user_review.strip():
            preprocessed_review = preprocess_review_with_custom_processing(user_review)
            predicted_sentiment = get_vader_sentiment(user_review)

            result = {
                'original': user_review,
                'preprocessed': preprocessed_review,
                'sentiment': predicted_sentiment
            }

    return render(request, "sentiment.html", {"result": result})
