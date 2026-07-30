from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy.pool import NullPool
from uuid import uuid4
from app.core.config import settings

database_uri = settings.SQLALCHEMY_DATABASE_URI
engine_options = {"echo": settings.DB_ECHO}

if "pooler.supabase.com" in database_uri:
    engine_options.update(
        {
            "poolclass": NullPool,
            "connect_args": {
                "prepared_statement_name_func": lambda: f"__asyncpg_{uuid4()}__",
            },
        }
    )

engine = create_async_engine(database_uri, **engine_options)

SessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

Base = declarative_base()

async def get_db():
    async with SessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
