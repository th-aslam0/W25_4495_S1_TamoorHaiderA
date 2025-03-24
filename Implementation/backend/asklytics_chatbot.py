import os
import streamlit as st
import pandas as pd
import asyncio
from langchain.chat_models import ChatOpenAI
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
from langchain.memory import ConversationBufferMemory
from langchain.agents import initialize_agent, Tool
from langchain.tools import tool

# ✅ Set up API key
#OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
#if not OPENAI_API_KEY:
 #   st.error("⚠️ OpenAI API Key missing. Set it in environment variables.")
  #  st.stop()

OPENAI_API_KEY =""

# ✅ Initialize Streamlit App
st.set_page_config(page_title="Asklytics: AI-powered Analytics")
st.title("Asklytics: AI-powered Analytics")
st.write("📊 Interact with the AI to analyze stock/housing data and get insights.")

# ✅ Upload dataset
data_file = st.file_uploader("📂 Upload your dataset (CSV)", type=["csv"])
if data_file:
    df = pd.read_csv(data_file)
    st.write("### 📝 Data Preview")
    st.write(df.head())
else:
    df = None  # Ensures `df` is defined globally

# ✅ Define Prompt Template
prompt_template = PromptTemplate(
    input_variables=["query"],
    template="""
    You are an AI data analyst. Answer user queries based on the provided dataset context.
    Query: {query}
    Response:
    """
)

# ✅ Initialize LLM and Memory
llm = ChatOpenAI(model_name="gpt-4o-mini", temperature=0.5, streaming=True, openai_api_key=OPENAI_API_KEY)
memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)

# ✅ Create LLM Chain
chain = LLMChain(llm=llm, prompt=prompt_template, memory=memory)

# ✅ Define Tools for Analytics
@tool
def analyze_sentiment(text: str) -> str:
    """Performs sentiment analysis on financial news headlines."""
    return f"Sentiment analysis result for: {text}"

@tool
def generate_predictions(query: str) -> str:
    """Generates predictions based on stock or housing data."""
    if df is not None:
        return f"📊 Predicting trends for {query} using uploaded dataset."
    return "⚠️ No dataset uploaded. Please upload a CSV file."

@tool
def summarize_data() -> str:
    """Provides a summary of the dataset."""
    if df is not None:
        return df.describe().to_string()
    return "⚠️ No dataset uploaded. Please upload a CSV file."

# ✅ Initialize Agent with Tools
tools = [
    Tool(name="Sentiment Analysis", func=analyze_sentiment, description="Analyze sentiment of text."),
    Tool(name="Stock/Housing Predictions", func=generate_predictions, description="Predict stock or housing prices."),
    Tool(name="Data Summary", func=summarize_data, description="Summarize the uploaded dataset."),
]

agent = initialize_agent(tools, llm, agent="zero-shot-react-description", verbose=True, memory=memory)

# ✅ User Input for Analysis
user_input = st.text_input("💬 Ask a question about your dataset:")
if user_input:
    async def stream_response():
        response = chain.run(user_input)  # Use chain for direct answers
        st.write(response)

        # Use Agent for different tasks
        if "sentiment" in user_input.lower():
            sentiment_result = agent.run("Sentiment Analysis", user_input)
            st.write(sentiment_result)
        elif "predict" in user_input.lower():
            prediction_result = agent.run("Stock/Housing Predictions", user_input)
            st.write(prediction_result)
        elif "summary" in user_input.lower():
            summary_result = agent.run("Data Summary")
            st.write(summary_result)

    asyncio.run(stream_response())

# ✅ Display Conversation History
st.subheader("📜 Chat History")
st.write(memory.load_memory_variables({}))
