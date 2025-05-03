
# 🩺 MediBot – AI-Powered Medical Intake Chatbot

**MediBot** is a modern chatbot designed for medical clinics. It collects patient data through a conversational UI, uses OpenAI to interpret unstructured text, and generates a downloadable PDF report for medical staff. Built with **Angular** (frontend) and **FastAPI** (backend), and containerized using **Docker Compose**.

---

## 🚀 Features

- Conversational interface styled like ChatGPT
- Smart input extraction using OpenAI
- Dynamic questions for missing info (e.g., age, gender, symptoms)
- Generates a structured PDF report
- Stateless — no patient data stored
- Easy to deploy with Docker Compose

---

## 🧰 Tech Stack

| Layer        | Tech         |
|-------------|--------------|
| Frontend     | Angular + Angular Material |
| Backend      | FastAPI (Python) |
| AI/NLP       | OpenAI GPT-4 API |
| PDF Engine   | ReportLab |
| Containerization | Docker + Docker Compose |
| Serving FE   | NGINX |

---

## 📁 Project Structure

```
.
├── chat-app/         # Angular frontend app
│   └── Dockerfile
├── python-bot/       # FastAPI backend
│   ├── api-be.py
│   ├── requirements.txt
│   └── Dockerfile
├── docker-compose.yml
```

---

## ⚙️ Prerequisites

- Docker
- Docker Compose
- OpenAI API Key

---

## 🔧 Setup & Run

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/medi-bot.git
cd medi-bot
```

### 2. Set Your OpenAI API Key

Set it in your terminal (no `.env` file used):

```bash
export OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxx
```

Windows CMD:

```cmd
set OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxx
```

---

### 3. Build and Run the App

```bash
docker-compose up --build
```

- 🧠 Backend: http://localhost:8000/docs
- 💬 Frontend Chatbot: http://localhost:4200

---

## 📝 Usage

1. User starts chatting with the bot.
2. The bot extracts:
   - Personal number
   - Name (optional)
   - Age
   - Gender
   - Symptoms
   - Duration
3. Missing details are requested dynamically.
4. Once complete, a PDF report is generated and downloaded.

---

## 📦 Build Notes

### Backend:

- Entry: `ap-be.py` with `app = FastAPI()`
- PDF generation using ReportLab
- OpenAI used to analyze patient input

### Frontend:

- Angular CLI project (`chat-app`)
- ChatGPT-like UI with Angular Material
- Calls backend API to analyze and generate report

---

## 🛡 Security

- No data is stored — all in-memory
- API key handled via environment variable
- CORS enabled for frontend-backend communication

---

## 📄 License

MIT License — free for personal and commercial use
