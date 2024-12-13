#!/bin/bash

# Activate the virtual environment
source venv/bin/activate

# Run the Flask server
export FLASK_APP=app.py  # Replace with your Flask application filename
export FLASK_ENV=development  # Optional: Enables debug mode
flask run
