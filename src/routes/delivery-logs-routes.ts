import { Router } from "express"

import{DeliveryLogsController} from "@/controllers/delivery-logs-controllers"
import { verifyUserAuthorization } from "@/middlewares/verifyUserAuthorization";
import { ensureAuthenticated } from "@/middlewares/ensureAuthenticated";


const deliveryLogsRoutes = Router()

const deliveryLogsController = new DeliveryLogsController()


deliveryLogsRoutes.post("/", ensureAuthenticated,verifyUserAuthorization(["sale"]), deliveryLogsController.create)
deliveryLogsRoutes.get("/:delivery_id/status", ensureAuthenticated,verifyUserAuthorization(["sale","customer"]), deliveryLogsController.show)



export {deliveryLogsRoutes}
