from sqlalchemy.orm import Session
from models import Dish
from schemas import DishCreate, DishUpdate


def get_dish(db: Session, dish_id: int):
    return db.query(Dish).filter(Dish.id == dish_id).first()


def get_dishes(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Dish).offset(skip).limit(limit).all()


def create_dish(db: Session, dish: DishCreate):
    db_dish = Dish(**dish.dict())
    db.add(db_dish)
    db.commit()
    db.refresh(db_dish)
    return db_dish


def update_dish(db: Session, dish_id: int, dish: DishUpdate):
    db_dish = get_dish(db, dish_id)
    if db_dish:
        update_data = dish.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_dish, key, value)
        db.commit()
        db.refresh(db_dish)
    return db_dish


def delete_dish(db: Session, dish_id: int):
    db_dish = get_dish(db, dish_id)
    if db_dish:
        db.delete(db_dish)
        db.commit()
    return db_dish


def filter_dishes_by_category(db: Session, category: str):
    return db.query(Dish).filter(Dish.category == category).all()


def search_dishes_by_name(db: Session, name: str):
    return db.query(Dish).filter(Dish.name.ilike(f"%{name}%")).all()


def get_dishes_sorted_by_price(db: Session, descending: bool = False):
    if descending:
        return db.query(Dish).order_by(Dish.price.desc()).all()
    return db.query(Dish).order_by(Dish.price.asc()).all()


def get_vegetarian_dishes(db: Session):
    return db.query(Dish).filter(Dish.is_vegetarian == True).all()


def get_dishes_by_max_price(db: Session, max_price: float):
    return db.query(Dish).filter(Dish.price <= max_price).all()


def get_all_categories(db: Session):
    dishes = get_dishes(db, skip=0, limit=1000)
    categories = set()
    for dish in dishes:
        if dish.category:
            categories.add(dish.category)
    return list(categories)


def get_dishes_statistics(db: Session):
    dishes = get_dishes(db, skip=0, limit=1000)

    if not dishes:
        return {
            "total_dishes": 0,
            "average_price": 0,
            "vegetarian_dishes": 0
        }

    total_dishes = len(dishes)
    total_price = sum(dish.price for dish in dishes)
    avg_price = total_price / total_dishes
    vegetarian_count = sum(1 for dish in dishes if dish.is_vegetarian)

    return {
        "total_dishes": total_dishes,
        "average_price": round(avg_price, 2),
        "vegetarian_dishes": vegetarian_count
    }