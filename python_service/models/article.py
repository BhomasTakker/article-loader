from pydantic import BaseModel, Field
from datetime import datetime
from bson import ObjectId
from .objectid import PyObjectId

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
