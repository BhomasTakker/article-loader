from datetime import datetime
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))

from fastapi import FastAPI, HTTPException, Query
import uvicorn
from db import articles_collection
from pydantic import BaseModel, Field

from bson import ObjectId
from pydantic_core import core_schema

class PyObjectId(str):
    @classmethod
    def __get_pydantic_core_schema__(cls, _source, _handler):
        return core_schema.no_info_after_validator_function(
            lambda v: str(v) if isinstance(v, ObjectId) else v,
            core_schema.any_schema()
        )

class Article(BaseModel):
    id: PyObjectId = Field(alias="_id")
    title: str | None = None
    src: str | None = None
    details: dict | None = None
    createdAt: datetime | None = None
    updatedAt: datetime | None = None
    description: str | None = None
    avatar: dict | None = None
    feed: PyObjectId | None = None
    provider: PyObjectId | None = None
    guid: str | None = None
    variant: str | None = None
    disabled: bool | None = None

    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True,
        "json_encoders": {ObjectId: str}
    }

app = FastAPI()

def convert_objectids(obj):
    if isinstance(obj, ObjectId):
        return str(obj)
    if isinstance(obj, list):
        return [convert_objectids(item) for item in obj]
    if isinstance(obj, dict):
        return {key: convert_objectids(value) for key, value in obj.items()}
    return obj


@app.get("/ping")
def ping():
    return {"status": "ok", "service": "python-service"}


@app.get("/articles", response_model=list[Article])
async def get_articles_by_region(
    region: str = Query(..., description="Region to filter articles by"),
    limit: int = Query(100, le=500, description="Number of articles to return"),
):
    
    query = {"variant": "article", "details.region": {"$regex": f"^{region}$", "$options": "i"}} 
    cursor = articles_collection.find(query).sort("createdAt", -1).limit(limit)

    results = await cursor.to_list(length=limit)
    # results = [convert_objectids(r) for r in results]

    if not results:
        raise HTTPException(status_code=404, detail=f"No articles found for region: {region}")

    return results



@app.get("/articles/group")
def get_articles_group():
    # Placeholder for the actual implementation
    return {"message": "This endpoint will return grouped articles."}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
