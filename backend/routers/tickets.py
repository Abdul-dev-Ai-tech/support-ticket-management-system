import math

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session

from database import get_db
from dependencies import get_current_user
from models import Ticket, User
from schemas import TicketCreate, TicketListResponse, TicketRead, TicketUpdate

router = APIRouter()

# Temporary workaround until authentication is implemented.
TEMP_USER_ID = 1


def get_temporary_user(db: Session) -> User:
    user = db.get(User, TEMP_USER_ID)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Temporary user with ID {TEMP_USER_ID} was not found. Create a user first.",
        )
    return user


@router.post("", response_model=TicketRead, status_code=status.HTTP_201_CREATED)
def create_ticket(
    ticket: TicketCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    new_ticket = Ticket(
        title=ticket.title,
        description=ticket.description,
        category=ticket.category,
        priority=ticket.priority,
        status="open",
        created_by=current_user.id,
    )

    db.add(new_ticket)
    db.commit()
    db.refresh(new_ticket)
    return new_ticket


@router.get("", response_model=TicketListResponse)
def get_tickets(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    status: str | None = Query(default=None),
    priority: str | None = Query(default=None),
    category: str | None = Query(default=None),
    search: str | None = Query(default=None),
):
    allowed_statuses = {"open", "in_progress", "resolved", "closed"}
    allowed_priorities = {"low", "medium", "high"}
    allowed_categories = {"technical", "billing", "account", "general"}

    if status is not None and status not in allowed_statuses:
        raise HTTPException(status_code=400, detail="Invalid status value")
    if priority is not None and priority not in allowed_priorities:
        raise HTTPException(status_code=400, detail="Invalid priority value")
    if category is not None and category not in allowed_categories:
        raise HTTPException(status_code=400, detail="Invalid category value")

    query = select(Ticket).where(Ticket.created_by == current_user.id)

    if status:
        query = query.where(Ticket.status == status)
    if priority:
        query = query.where(Ticket.priority == priority)
    if category:
        query = query.where(Ticket.category == category)
    if search:
        search_term = f"%{search.strip()}%"
        query = query.where(or_(Ticket.title.ilike(search_term), Ticket.description.ilike(search_term)))

    total = db.scalar(select(func.count()).select_from(query.subquery()))
    total_pages = math.ceil(total / limit) if total else 0

    tickets = db.execute(
        query.order_by(Ticket.created_at.desc()).offset((page - 1) * limit).limit(limit)
    ).scalars().all()

    return {
        "items": tickets,
        "page": page,
        "limit": limit,
        "total": total or 0,
        "total_pages": total_pages,
    }


@router.get("/{ticket_id}", response_model=TicketRead)
def get_ticket(
    ticket_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    ticket = db.get(Ticket, ticket_id)
    if ticket is None:
        raise HTTPException(status_code=404, detail="Ticket not found")
    if ticket.created_by != current_user.id:
        raise HTTPException(status_code=403, detail="You are not allowed to access this ticket")
    return ticket


@router.patch("/{ticket_id}", response_model=TicketRead)
def update_ticket(
    ticket_id: int,
    ticket_update: TicketUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    ticket = db.get(Ticket, ticket_id)
    if ticket is None:
        raise HTTPException(status_code=404, detail="Ticket not found")
    if ticket.created_by != current_user.id:
        raise HTTPException(status_code=403, detail="You are not allowed to update this ticket")

    update_data = ticket_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(ticket, field, value)

    db.commit()
    db.refresh(ticket)
    return ticket


@router.delete("/{ticket_id}")
def delete_ticket(
    ticket_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    ticket = db.get(Ticket, ticket_id)
    if ticket is None:
        raise HTTPException(status_code=404, detail="Ticket not found")
    if ticket.created_by != current_user.id:
        raise HTTPException(status_code=403, detail="You are not allowed to delete this ticket")

    db.delete(ticket)
    db.commit()
    return {"message": "Ticket deleted successfully"}
