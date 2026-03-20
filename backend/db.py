from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

from config import settings


mongo_client: AsyncIOMotorClient | None = None
database: AsyncIOMotorDatabase | None = None


async def connect_to_mongo() -> None:
    global mongo_client, database

    mongo_client = AsyncIOMotorClient(settings.mongo_uri)
    database = mongo_client[settings.mongo_db_name]

    # Ensure email uniqueness at the database layer to prevent duplicates in race conditions.
    await database["users"].create_index("email", unique=True)


async def close_mongo_connection() -> None:
    global mongo_client

    if mongo_client is not None:
        mongo_client.close()


def get_database() -> AsyncIOMotorDatabase:
    if database is None:
        raise RuntimeError("Database is not initialized.")
    return database
