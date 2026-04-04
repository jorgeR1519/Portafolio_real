from fastapi import APIRouter
from app.data.projects import projects_data

router = APIRouter(prefix="/projects", tags=["projects"])


@router.get("")
def list_projects():
    return projects_data