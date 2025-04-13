import asyncio
import requests
import re

from agent import QueueCallbackHandler, agent_executor
from review_agent import QueueCallbackHandlerReview, reviews_agent_executor
from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta
from bs4 import BeautifulSoup

# initilizing our application
app = FastAPI()
reports_dict = {}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Your frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

@app.get("/")
async def root():
    return {"message": "Asklytics backend is running"}

def extract_reviews_from_gb_url(url: str) -> str:
    headers = {"User-Agent": "Mozilla/5.0"}
    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        raise Exception(f"Failed to fetch page. Status: {response.status_code}")

    soup = BeautifulSoup(response.text, "html.parser")

    # Fallback: extract all text nodes that contain "review"
    raw_reviews = soup.find_all(string=re.compile("review", re.IGNORECASE))
    if not raw_reviews:
        return "Sample review: Excellent experience! Staff was helpful."

    # Join and clean the raw text
    combined_text = " ".join([r.strip() for r in raw_reviews])

    # Extract and filter clean human-like sentences
    sentence_pattern = re.compile(r'([A-Z][^.!?]{10,300}[.!?])')
    sentences = sentence_pattern.findall(combined_text)
    human_sentences = [
        s.strip() for s in sentences
        if (
            re.search(r'[a-zA-Z]', s) and               # must have letters
            not re.search(r'[{}<>;:=]', s) and          # no weird symbols
            'null' not in s.lower()                     # not 'null'
        )
    ]
    return human_sentences if human_sentences else "Sample review: Excellent experience! Staff was helpful."

@app.post("/reviews")
async def analyze_reviews(request: Request):
    body = await request.json()
    url = body.get("url")

    try:
        reviews_text = extract_reviews_from_gb_url(url)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=400)

    return JSONResponse(
        content={"reviews": "The text given below is a Web Scrapped response from Google Maps for a business. There is lot of garbage in the text but please ignore and don't mention anything about that in your responses. Do a sentiment analysis and rate the user reviews in Positive, Negative or Neutral. Given a list of 3 reviews, it should be the text of review by user along with the tone. If less than three are found in text, show as many as are available. Mark them Positive, Negative or Neutral. Also give an overall user sentiment to my business based on all the users reviews like an average mood meter. Here comes the scraped text: \n\n\n" + '\n'.join(reviews_text)})
# streaming function
async def token_generator(content: str, streamer: QueueCallbackHandler):
    task = asyncio.create_task(agent_executor.invoke(
        input=content,
        streamer=streamer,
        verbose=True  # set to True to see verbose output in console
    ))
    # initialize various components to stream
    async for token in streamer:
        try:
            if token == "<<STEP_END>>":
                # send end of step token
                yield "</step>"
            elif tool_calls := token.message.additional_kwargs.get("tool_calls"):
                if tool_name := tool_calls[0]["function"]["name"]:
                    # send start of step token followed by step name tokens
                    yield f"<step><step_name>{tool_name}</step_name>"
                if tool_args := tool_calls[0]["function"]["arguments"]:
                    # tool args are streamed directly, ensure it's properly encoded
                    yield tool_args
        except Exception as e:
            print(f"Error streaming token: {e}")
            continue
    await task

async def token_generator_reviews(content: str, streamer: QueueCallbackHandler):
    task = asyncio.create_task(reviews_agent_executor.invoke(
        input=content,
        streamer=streamer,
        verbose=True  # set to True to see verbose output in console
    ))
    # initialize various components to stream
    async for token in streamer:
        try:
            if token == "<<STEP_END>>":
                # send end of step token
                yield "</step>"
            elif tool_calls := token.message.additional_kwargs.get("tool_calls"):
                if tool_name := tool_calls[0]["function"]["name"]:
                    # send start of step token followed by step name tokens
                    yield f"<step><step_name>{tool_name}</step_name>"
                if tool_args := tool_calls[0]["function"]["arguments"]:
                    # tool args are streamed directly, ensure it's properly encoded
                    yield tool_args
        except Exception as e:
            print(f"Error streaming token: {e}")
            continue
    await task

def run_ga4_report(access_token: str, property_id: str):
    url = f"https://analyticsdata.googleapis.com/v1beta/properties/{property_id}:runReport?access_token={access_token}"
    headers = {
        "Content-Type": "application/json"
    }

    end_date = datetime.today().strftime('%Y-%m-%d')
    start_date = (datetime.today() - timedelta(days=365)).strftime('%Y-%m-%d')

    payload = {
        "dimensions": [
            {"name": "date"},
            {"name": "country"},
            {"name": "deviceCategory"},
            {"name": "browser"},
            {"name": "city"}
        ],
        "metrics": [
            {"name": "sessions"},
            {"name": "totalUsers"},
            {"name": "newUsers"},
            {"name": "engagedSessions"},
            {"name": "engagementRate"},
            {"name": "averageSessionDuration"},
            {"name": "bounceRate"},
            {"name": "conversions"},
            {"name": "eventCount"},
            {"name": "screenPageViews"}
        ],
        "dateRanges": [
            {"startDate": start_date, "endDate": end_date}
        ],
        "limit": 1000  # You can adjust or paginate if needed
    }

    response = requests.post(url, headers=headers, json=payload)

    if response.status_code == 200:
        return "This is a response from Google Analytics Admin API about my website. Respond the questions based on this data.\n" + str(response.json())
    else:
        raise Exception(f"Error {response.status_code}: {response.text}")

# invoke function
@app.post("/invoke")
async def invoke(content: str, access_token: str, property_id: str):
    if access_token not in reports_dict:
        reports_dict[access_token] = run_ga4_report(access_token, property_id)
    report = reports_dict.get(access_token)
    queue: asyncio.Queue = asyncio.Queue()
    streamer = QueueCallbackHandler(queue)
    # return the streaming response
    return StreamingResponse(
        token_generator(report + '\n\n\n' +content, streamer),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        }
    )

# invoke function
@app.post("/review-invoke")
async def invoke(request: Request):
    body = await request.json()
    content = body.get("body", {}).get("reviews")
    print(body)
    queue: asyncio.Queue = asyncio.Queue()
    streamer = QueueCallbackHandlerReview(queue)
    # return the streaming response
    return StreamingResponse(
        token_generator_reviews(content, streamer),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        }
    )