from bson import ObjectId
from pydantic_core import core_schema

class PyObjectId(str):
    @classmethod
    def __get_pydantic_core_schema__(cls, _source, _handler):
        return core_schema.no_info_after_validator_function(
            lambda v: str(v) if isinstance(v, ObjectId) else v,
            core_schema.any_schema()
        )
