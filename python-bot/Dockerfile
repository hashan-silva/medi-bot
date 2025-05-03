# Use official Python image
FROM python:3.10

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install openai==0.28
COPY . .

CMD ["uvicorn", "api-be:app", "--host", "0.0.0.0", "--port", "8000"]