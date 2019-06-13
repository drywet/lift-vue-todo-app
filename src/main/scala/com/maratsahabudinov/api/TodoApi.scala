package com.maratsahabudinov.api

import com.maratsahabudinov.domain.{TodoItem, TodoItemAddDto}
import com.maratsahabudinov.store.TodoItemStore
import net.liftweb.http.OkResponse
import net.liftweb.http.rest.RestHelper
import net.liftweb.json.Extraction._
import net.liftweb.json.JValue
import net.liftweb.util.Helpers.AsInt

object TodoApi extends RestHelper {

  def list: JValue = {
    decompose(TodoItemStore.list)
  }

  def get(id: Int): Option[JValue] = {
    TodoItemStore.get(id).map(decompose)
  }

  def add(jsonItem: JValue): JValue = {
    val item = jsonItem.extract[TodoItemAddDto]
    decompose(TodoItemStore.add(item))
  }

  def saveAll(jsonItems: JValue): JValue = {
    val items = jsonItems.extract[List[TodoItem]]
    decompose(TodoItemStore.saveAll(items))
  }

  def update(id: Int, jsonItem: JValue): JValue = {
    val item = jsonItem.extract[TodoItemAddDto]
    decompose(TodoItemStore.update(id, item))
  }

  def delete(id: Int): OkResponse = {
    TodoItemStore.delete(id)
    new OkResponse
  }

  serve {
    case "api" :: "todo" :: Nil JsonGet req => list
    case "api" :: "todo" :: AsInt(id) :: Nil JsonGet req => get(id)
    case "api" :: "todo" :: Nil JsonPost ((json, req)) => add(json)
    case "api" :: "todo" :: "saveAll" :: Nil JsonPost ((json, req)) => saveAll(json)
    case "api" :: "todo" :: AsInt(id) :: Nil JsonPost ((json, req)) => update(id, json)
    case "api" :: "todo" :: AsInt(id) :: Nil JsonDelete req => delete(id)
  }
}