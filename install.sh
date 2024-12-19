#!/bin/bash

# Create and activate a virtual environment
python3.10 -m venv venv
. venv/bin/activate

# Install required Python packages
pip install --upgrade pip  # Optional: Upgrade pip
pip install nltk numpy Flask torch torchvision random

echo "Installation complete. Activate the virtual environment with 'source venv/bin/activate' and use './run.sh' to start the server."
