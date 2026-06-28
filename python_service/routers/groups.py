from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_articles_group():
    return {"message": "This endpoint will return grouped articles."}
