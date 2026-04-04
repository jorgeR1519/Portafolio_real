from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers.projects import router as projects_router
from app.routers.contact import router as contact_router

app = FastAPI(title="Portfolio API", version="1.0.0")

allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(projects_router, prefix="/api")
app.include_router(contact_router, prefix="/api")


@app.get("/")
def root():
    return {"message": "Portfolio API running"}


@app.get("/health")
def health():
    return {"status": "ok"}
