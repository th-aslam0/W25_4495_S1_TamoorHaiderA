## Run the API
* `uv python install 3.12.7`
* `uv venv --python 3.12.7`
* `uv sync`
* `source .venv/bin/activate`
* `source mac.env`
* `cd` into the `/api` directory
* execute `uv run uvicorn main:app --reload` to start the API
* you can find the API docs at `http://localhost:8000/docs`

## Run the App

* `cd` into the `/app` directory
* execute `npm install` to install the dependencies
* execute `npm run dev` to start the app
* you can find the app at `http://localhost:3000`
