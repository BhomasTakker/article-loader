from fastapi import FastAPI
from python_service.routers import articles, groups, health

app = FastAPI()

app.include_router(health.router)
app.include_router(articles.router, prefix="/articles")
app.include_router(groups.router, prefix="/articles/group")