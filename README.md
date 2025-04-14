# Project: Asklytics
An LLM for Website Analytics with Sentiment Analysis of Google Analytics 4 (GA-4) & Google Maps Reviews Data

### Course:
```
COMP-4495 
Applied Research Project
Section: 001
```

#### Team Members
*Team Lead:* Tamoor Haider Aslam (300367290)
Mohamed Nuskhan Mohamed Niyas (300368621)

#### Repository Name: 
W25_4495_S1_TamoorHaiderA

# Installation Guide

## Frontend Requirements
- Node.js v18 or newer  
- A modern web browser (e.g., Chrome)

## Backend Requirements
- Python 3.12.7  
- `uv` (a fast Python package manager)

### Install `uv`:

`curl -Ls https://astral.sh/uv/install.sh | sh`


### 1. Clone the repo
```git clone https://github.com/th-aslam0/W25_4495_S1_TamoorHaiderA.git```

### 2. For frontend
1. ```cd Implementation/Asklytics/app```
2. ```npm install```
3. ```npm run dev```
4. The turbo server will start on `http://localhost:3000/`
5. Navigate to
	- `http://localhost:3000`


### 3. For Backend
1. ```cd Implementation/Asklytics```
2. `uv python install 3.12.7`
3. `uv venv --python 3.12.7`
4. `uv sync`
5. `source .venv/bin/activate`
5. Paste API secret to `mac.env` (sent in email to `kandhadaip@douglascollege.ca`) 
6. `source mac.env` 
7. `cd` into the `/api` directory, type `cd api`
8. Run `uv run uvicorn main:app --reload` to start the API

### Test Website with GA4 Added
- https://th-aslam.github.io

### ~~4. For Mistral2.ipynb~~ ***(Deprecated)***
~~1. ```cd Implementation/backend/models_analysis```
2. Open ```Implementation/backend/models_analysis/mistral2.ipynb``` in VSCode or JupyterNote Book or Kaggle Notebook
3. Run the file, you will be asked to enter the api key & token from Hugging face, please find it in our email.~~



#### Contributions Document Link
Please find the contribution document here [LINK](https://collegedouglas-my.sharepoint.com/:x:/g/personal/aslamt_student_douglascollege_ca/EV1uNtkR9BZJuQqxwRBwRLgB9xMFlTfAKqok4a52iBSnmw?e=KFWBci)
