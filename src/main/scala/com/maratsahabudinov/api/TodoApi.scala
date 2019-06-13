package com.maratsahabudinov.api

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

  def post(jsonData: JValue): JValue = {
    decompose(
      TodoItemStore.add(
        text = (jsonData \ "text").extract[String]
      )
    )
  }

  def delete(id: Int): OkResponse = {
    TodoItemStore.delete(id)
    new OkResponse
  }

  serve {
    case "api" :: "todo" :: Nil JsonGet req => list
    case "api" :: "todo" :: AsInt(id) :: Nil JsonGet req => get(id)
    case "api" :: "todo" :: AsInt(id) :: Nil JsonDelete req => delete(id)
    case "api" :: "todo" :: Nil JsonPost ((jsonData, req)) => post(jsonData)
  }
}