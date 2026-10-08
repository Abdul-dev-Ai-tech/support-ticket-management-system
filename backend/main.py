from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import Base, engine
from routers import auth as auth_router
from routers import tickets as tickets_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Support Ticket Management System")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router.router, prefix="/api/auth", tags=["auth"])
app.include_router(tickets_router.router, prefix="/api/tickets", tags=["tickets"])


@app.get("/")
def read_root():
    return {"message": "Support Ticket API is running"}
