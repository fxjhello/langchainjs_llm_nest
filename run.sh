#!/bin/bash

cd service
pnpm start:dev
cd ../models/ChatGLM-6B
python3 api.py
cd ../embedding
python3 api.py
cd ../../views
pnpm run dev
