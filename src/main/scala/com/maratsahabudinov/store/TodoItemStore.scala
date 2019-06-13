package com.maratsahabudinov.store

import com.maratsahabudinov.domain.{TodoItem, TodoItemAddDto}

object TodoItemStore {

  private var store: List[TodoItem] = List(
    TodoItem(1, "Buy tomatoes", completed = false),
    TodoItem(2, "Eat tomatoes", completed = false)
  )

  def list: Seq[TodoItem] = {
    store
  }

  def get(id: Int): Option[TodoItem] = {
    store.find(_.id == id)
  }

  def add(x: TodoItemAddDto): TodoItem = {
    val id = store.map(_.id).max + 1
    val item = TodoItem(
      id = id,
      title = x.title,
      completed = x.completed
    )
    store ::= item
    item
  }

  def saveAll(items: List[TodoItem]): List[TodoItem] = {
    store = items
    items
  }

  def update(id: Int, itemDto: TodoItemAddDto): TodoItem = {
    val item = TodoItem(
      id = id,
      title = itemDto.title,
      completed = itemDto.completed
    )
    store = store.patch(store.indexWhere(_.id == id), List(item), 1)
    item
  }

  def delete(id: Int): Unit = {
    store = store.filterNot(_.id == id)
  }

}
