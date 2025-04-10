import asyncio
import requests

from agent import QueueCallbackHandler, agent_executor
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta

# initilizing our application
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Your frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

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
    report = run_ga4_report(access_token, property_id)
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
