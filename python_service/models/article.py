from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime
from bson import ObjectId
from .objectid import PyObjectId

class Article(BaseModel):
    id: PyObjectId = Field(alias="_id")
    title: Optional[str] = None
    src: Optional[str] = None
    details: Optional[Dict[str, Any]] = None
    createdAt: Optional[datetime] = None
    updatedAt: Optional[datetime] = None
    description: Optional[str] = None
    avatar: Optional[Dict[str, Any]] = None
    feed: Optional[PyObjectId] = None
    provider: Optional[PyObjectId] = None
    guid: Optional[str] = None
    variant: Optional[str] = None
    disabled: Optional[bool] = None

    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True,
        "json_encoders": {ObjectId: str}
    }
