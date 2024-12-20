#!/bin/bash

# # Activate the virtual environment
# . venv/bin/activate

# Run the training script
echo "Starting training..."
python train.py

# Start the Flask server
echo "Starting the Flask server..."
export FLASK_APP=app.py  # Replace with your Flask application filename
export FLASK_ENV=development  # Optional: Enables debug mode
flask run