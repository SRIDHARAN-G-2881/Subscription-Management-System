import { createPlan,deletePlan,updatePlan ,getPlans} from "../controllers/PlanController.js";
import express from "express";

const planroute=express.Router();
planroute.post('/create',createPlan);
planroute.get('/getplans',getPlans);
planroute.post('/delete/:id',deletePlan);
planroute.post('/update/:id',updatePlan);

export default planroute;


