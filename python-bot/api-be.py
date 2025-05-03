import json
import os
from io import BytesIO

import openai
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from reportlab.pdfgen import canvas

app = FastAPI()

# Enable CORS (allow frontend to call backend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change "*" to your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Set your OpenAI key
openai.api_key = os.getenv("OPENAI_API_KEY")

# -----------------------------
# Data Models
# -----------------------------

class Message(BaseModel):
    message: str

class PatientData(BaseModel):
    personal_number: str
    age: str
    gender: str
    symptoms: str
    duration: str
    name: str = None  # optional

# -----------------------------
# Endpoints
# -----------------------------

@app.post("/analyze")
async def analyze_input(msg: Message):
    prompt = f"""
    Analyze this patient input: "{msg.message}"

    Extract these fields:
    - personal_number
    - age
    - gender
    - symptoms
    - duration
    (name is optional)

    If a field is missing, set its value to "missing".

    Reply in pure JSON format like:
    {{
      "personal_number": "...",
      "age": "...",
      "gender": "...",
      "symptoms": "...",
      "duration": "...",
      "name": "..."
    }}
    """

    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are a medical assistant helping intake patients."},
            {"role": "user", "content": prompt}
        ]
    )

    content = response.choices[0].message['content']
    print(content)
    return json.loads(content)  # careful, content must be safe JSON. You could also use `json.loads(content)`.

@app.post("/generate-pdf")
async def generate_pdf(patient: PatientData):
    buffer = BytesIO()
    p = canvas.Canvas(buffer)

    p.setFont("Helvetica", 14)
    p.drawString(100, 800, "Patient Health Report")
    p.setFont("Helvetica", 12)

    y = 760
    fields = [
        ("Personal Number", patient.personal_number),
        ("Age", patient.age),
        ("Gender", patient.gender),
        ("Symptoms", patient.symptoms),
        ("Duration", patient.duration),
    ]
    if patient.name:
        fields.insert(0, ("Name", patient.name))

    for label, value in fields:
        p.drawString(100, y, f"{label}: {value}")
        y -= 30

    p.save()
    buffer.seek(0)

    return StreamingResponse(buffer, media_type="application/pdf", headers={
        "Content-Disposition": "attachment; filename=patient_report.pdf"
    })

# -----------------------------
# Run the app (if running locally)
# -----------------------------

# Uncomment to run directly
#if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="0.0.0.0", port=8000)