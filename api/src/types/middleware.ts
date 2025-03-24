import { Request } from "express";
import { IAdmin, IUser } from "./models";
import { Types } from "mongoose";
import { IUserDocument } from "../models/User";

export interface RequestWithAdmin extends Request {
    admin?: IAdmin & { _id: Types.ObjectId; };
};

export interface RequestWithUser extends Request {
    user?: IUserDocument;
};