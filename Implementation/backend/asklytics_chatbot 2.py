import os
import streamlit as st
import pandas as pd
import asyncio
from langchain.chat_models import ChatOpenAI
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
from langchain.memory import ConversationBufferMemory
from langchain.schema import SystemMessage
from langchain.tools import tool
from langchain_core.runnables import RunnableParallel, RunnablePassthrough

# ✅ Set up API key
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")

# ✅ Initialize Streamlit App
st.set_page_config(page_title="Asklytics: AI-powered Analytics")
st.title("Asklytics: AI-powered Analytics")
st.write("📊 Interact with the AI to analyze stock/housing data and get insights.")

# ✅ Upload dataset
data_file = st.file_uploader("📂 Upload your dataset (CSV)", type=["csv"])
df = pd.read_csv(data_file) if data_file else None

# ✅ Define Prompt Template
prompt_template = PromptTemplate(
    input_variables=["query"],
    template="""
    You are an AI data analyst. Answer user queries based on the provided dataset context.
    Query: {query}
    Response:
    """
)

# ✅ Initialize LLM with Streaming
llm = ChatOpenAI(model_name="gpt-4o-mini", temperature=0.5, streaming=True, openai_api_key=OPENAI_API_KEY)
memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)

# ✅ Create LLM Chain with Streaming
chain = LLMChain(llm=llm, prompt=prompt_template, memory=memory)

# ✅ Define Tools using LCEL
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

# ✅ Create a Runnable using LCEL
analytics_pipeline = RunnableParallel(
    {"query": RunnablePassthrough(), "sentiment": analyze_sentiment, "summary": summarize_data}
)

# ✅ User Input for Analysis
user_input = st.text_input("💬 Ask a question about your dataset:")
if user_input:
    async def stream_response():
        with st.spinner("🧠 Thinking..."):
            response = chain.run(user_input)  # LLM response
            st.write(response)

            # Stream output from LCEL tools
            result = analytics_pipeline.invoke({"query": user_input})
            if "sentiment" in user_input.lower():
                st.write("🔍 Sentiment Analysis:", result["sentiment"])
            if "summary" in user_input.lower():
                st.write("📊 Dataset Summary:", result["summary"])

    asyncio.run(stream_response())

# ✅ Display Conversation History
st.subheader("📜 Chat History")
st.write(memory.load_memory_variables({}))

