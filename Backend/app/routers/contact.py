from fastapi import APIRouter
from app.schemas.contact import ContactSchema

router = APIRouter(prefix="/contact", tags=["contact"])


@router.post("")
def send_contact(payload: ContactSchema):
    return {
        "message": "Mensaje recibido correctamente",
        "data": payload.model_dump(),
    }