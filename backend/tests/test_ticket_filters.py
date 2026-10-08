from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from database import Base, get_db
from main import app
from models import Ticket, User

engine = create_engine(
    "sqlite://",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)


def seed_tickets():
    db = TestingSessionLocal()
    db.query(Ticket).delete()

    user = db.query(User).filter(User.email == "tester@example.com").first()
    if user is None:
        user = User(name="Tester", email="tester@example.com", password_hash="hashed")
        db.add(user)
        db.commit()
        db.refresh(user)

    tickets = [
        Ticket(
            title="Reset password issue",
            description="Customer cannot reset password after email change.",
            category="account",
            priority="high",
            status="open",
            created_by=user.id,
        ),
        Ticket(
            title="Invoice mismatch",
            description="Billing team needs explanation for a password reset invoice.",
            category="billing",
            priority="high",
            status="open",
            created_by=user.id,
        ),
        Ticket(
            title="Laptop crash",
            description="Laptop keeps crashing after Windows update.",
            category="technical",
            priority="medium",
            status="resolved",
            created_by=user.id,
        ),
        Ticket(
            title="Access request",
            description="Need help with account access for a new teammate.",
            category="account",
            priority="low",
            status="closed",
            created_by=user.id,
        ),
    ]

    db.add_all(tickets)
    db.commit()
    db.close()


def test_get_tickets_supports_page_limit_and_filters():
    client.post(
        "/api/auth/register",
        json={"name": "Tester", "email": "tester@example.com", "password": "secret123"},
    )
    token = client.post(
        "/api/auth/login",
        json={"email": "tester@example.com", "password": "secret123"},
    ).json()["access_token"]

    seed_tickets()

    response = client.get(
        "/api/tickets/?page=1&limit=2&status=open&priority=high&category=account&search=password",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert response.status_code == 200
    payload = response.json()

    assert payload["page"] == 1
    assert payload["limit"] == 2
    assert payload["total"] == 1
    assert payload["total_pages"] == 1
    assert len(payload["items"]) == 1
    assert payload["items"][0]["title"] == "Reset password issue"
