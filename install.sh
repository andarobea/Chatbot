#!/bin/bash

# Create and activate a virtual environment
python3 -m venv venv
. venv/bin/activate

# Install required Python packages
pip install --upgrade pip  # Optional: Upgrade pip
#pip install nltk numpy Flask torch torchvision random
pip install nltk
pip install numpy
pip install Flask
pip install torch
pip install torchvision
pip install random2

echo "Installation complete. Activate the virtual environment with 'source venv/bin/activate' and use './run.sh' to start the server."