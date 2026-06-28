from fastapi import APIRouter, Query, HTTPException
from db import articles_collection
from models.article import Article

router = APIRouter()

@router.get("/", response_model=list[Article])
async def get_articles_by_region(
    region: str = Query(...),
    limit: int = Query(100, le=500),
):
    query = {
        "variant": "article",
        "details.region": {"$regex": f"^{region}$", "$options": "i"}
    }

    cursor = articles_collection.find(query).sort("createdAt", -1).limit(limit)
    results = await cursor.to_list(length=limit)

    if not results:
        raise HTTPException(404, f"No articles found for region: {region}")

    return results