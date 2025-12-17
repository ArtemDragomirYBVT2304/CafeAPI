from sqlalchemy import Column, Integer, String, Float, Boolean
from database import Base

class Dish(Base):
    __tablename__ = "dishes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    description = Column(String, nullable=True)
    price = Column(Float, nullable=False)
    category = Column(String, index=True, nullable=False)
    calories = Column(Integer, nullable=True)
    is_vegetarian = Column(Boolean, default=False)