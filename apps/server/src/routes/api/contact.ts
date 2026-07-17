import { Router } from "express";
import {
  getContactNonce,
  submitContact,
} from "../../controllers/contactController";

export const contactRouter = Router();

contactRouter.get("/nonce", getContactNonce);
contactRouter.post("", submitContact);
