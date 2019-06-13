package com.maratsahabudinov.store

import com.maratsahabudinov.domain.TodoItem

object TodoItemStore {

  private var store: List[TodoItem] = TodoItem(1, "Buy tomatoes") :: Nil

  def list: Seq[TodoItem] = {
    store
  }

  def get(id: Int): Option[TodoItem] = {
    store.find(_.id == id)
  }

  def add(text: String): TodoItem = {
    val id = store.map(_.id).max + 1
    val item = TodoItem(id, text)
    store ::= item
    item
  }

  def delete(id: Int): Unit = {
    store = store.filterNot(_.id == id)
  }

}
