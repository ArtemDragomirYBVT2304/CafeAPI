from pydantic import BaseModel, Field
from typing import Optional

class DishBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    price: float = Field(..., gt=0)
    category: str = Field(..., min_length=1, max_length=50)
    calories: Optional[int] = Field(None, ge=0)
    is_vegetarian: bool = False

class DishCreate(DishBase):
    pass

class DishUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    price: Optional[float] = Field(None, gt=0)
    category: Optional[str] = Field(None, min_length=1, max_length=50)
    calories: Optional[int] = Field(None, ge=0)
    is_vegetarian: Optional[bool] = None

class Dish(DishBase):
    id: int

    class Config:
        orm_mode = True