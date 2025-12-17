from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from database import SessionLocal
import crud
import schemas

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/dishes/", response_model=schemas.Dish)
def create_dish(dish: schemas.DishCreate, db: Session = Depends(get_db)):
    return crud.create_dish(db=db, dish=dish)


@router.get("/dishes/", response_model=List[schemas.Dish])
def read_dishes(
        skip: int = 0,
        limit: int = 100,
        category: Optional[str] = None,
        name: Optional[str] = None,
        max_price: Optional[float] = None,
        vegetarian: Optional[bool] = None,
        sort_by_price: Optional[bool] = None,
        db: Session = Depends(get_db)
):
    if category:
        dishes = crud.filter_dishes_by_category(db, category)
    elif name:
        dishes = crud.search_dishes_by_name(db, name)
    elif max_price is not None:
        dishes = crud.get_dishes_by_max_price(db, max_price)
    elif vegetarian is not None:
        dishes = crud.get_vegetarian_dishes(db)
    elif sort_by_price is not None:
        dishes = crud.get_dishes_sorted_by_price(db, descending=sort_by_price)
    else:
        dishes = crud.get_dishes(db, skip=skip, limit=limit)

    return dishes


@router.get("/dishes/{dish_id}", response_model=schemas.Dish)
def read_dish(dish_id: int, db: Session = Depends(get_db)):
    db_dish = crud.get_dish(db, dish_id=dish_id)
    if db_dish is None:
        raise HTTPException(status_code=404, detail="Dish not found")
    return db_dish


@router.put("/dishes/{dish_id}", response_model=schemas.Dish)
def update_dish(dish_id: int, dish: schemas.DishUpdate, db: Session = Depends(get_db)):
    db_dish = crud.update_dish(db, dish_id=dish_id, dish=dish)
    if db_dish is None:
        raise HTTPException(status_code=404, detail="Dish not found")
    return db_dish


@router.delete("/dishes/{dish_id}")
def delete_dish(dish_id: int, db: Session = Depends(get_db)):
    db_dish = crud.delete_dish(db, dish_id=dish_id)
    if db_dish is None:
        raise HTTPException(status_code=404, detail="Dish not found")
    return {"message": f"Dish with id {dish_id} deleted successfully"}


@router.get("/categories/")
def get_categories(db: Session = Depends(get_db)):
    categories = crud.get_all_categories(db)
    return categories


@router.get("/statistics/")
def get_statistics(db: Session = Depends(get_db)):
    stats = crud.get_dishes_statistics(db)
    return stats