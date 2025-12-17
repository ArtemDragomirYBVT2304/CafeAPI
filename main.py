from fastapi import FastAPI
from database import engine, Base
from routers import router
import models

app = FastAPI(
    title="Cafe Menu API",
    description="API for cafe menu management",
    version="1.0.0"
)

Base.metadata.create_all(bind=engine)

app.include_router(router, prefix="/api/v1")

@app.get("/")
def root():
    return {
        "message": "Welcome to Cafe Menu API",
        "docs": "/docs",
        "redoc": "/redoc"
    }
