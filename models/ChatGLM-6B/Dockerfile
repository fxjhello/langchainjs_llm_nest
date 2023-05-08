FROM python:3.8.10
RUN mkdir -p /home/test/ChatGLM-6B
WORKDIR /home/test/ChatGLM-6B
COPY . .
RUN python -m pip install -i https://pypi.tuna.tsinghua.edu.cn/simple/ --upgrade pip
RUN pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple/
EXPOSE 8000
CMD ["python", "api.py"]
