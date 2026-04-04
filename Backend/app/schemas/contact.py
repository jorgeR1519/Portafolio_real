from pydantic import BaseModel, EmailStr


class ContactSchema(BaseModel):
    name: str
    email: EmailStr
    message: str