package bootstrap.liftweb

import com.maratsahabudinov.api.TodoApi
import net.liftweb.http._

/**
  * A class that's instantiated early and run.  It allows the application
  * to modify lift's environment
  */
class Boot {
  def boot {
    LiftRules.dispatch.append(TodoApi)
  }
}
