import { Request, Response } from "express";
import { omit } from "lodash";
import asyncWrapper from "../utils/asyncWrapper";
import { ExtendedError } from "../types";
import {
  CreateUserInput,
  UpdateUserInput,
  DeleteUserInput,
  GetUserInput,
} from "../schema/user.schema";
import {
  createUser,
  updateUser,
  deleteUser,
  findUser,
  allUsers,
} from "../service/user.service";

const userController = (() => {
  const create = asyncWrapper(
    async (req: Request<{}, {}, CreateUserInput["body"]>, res: Response) => {
      const user = await createUser(req.body);
      res.send(omit(user.toJSON(), "password"));
    }
  );

  const update = asyncWrapper(
    async (
      req: Request<UpdateUserInput["params"], {}, UpdateUserInput["body"]>,
      res: Response
    ) => {
      const id = req.params.userId;
      const update = req.body;
      const foundUser = await findUser({ id });

      if (!foundUser) {
        throw new ExtendedError("User not found", 404);
      }

      const updatedUser = await updateUser({ _id: id }, update, { new: true });

      if (updatedUser) {
        res.send(omit(updatedUser.toJSON(), "password"));
      } else {
        throw new ExtendedError("DB error updating the user", 500);
      }
    }
  );

  const remove = asyncWrapper(
    async (req: Request<DeleteUserInput["params"], {}, {}>, res: Response) => {
      const userId = req.params.userId;
      const foundUser = await findUser({ id: userId });

      if (!foundUser) {
        throw new ExtendedError("User not found", 404);
      }

      const deletedUser = await deleteUser({ _id: userId });

      if (deletedUser) {
        res.send(omit(deletedUser.toJSON(), "password"));
      } else {
        throw new ExtendedError("DB error deleting the user", 500);
      }
    }
  );

  const get = asyncWrapper(
    async (req: Request<GetUserInput["params"], {}, {}>, res: Response) => {
      const userId = req.params.userId;
      const foundUser = await findUser({ id: userId });

      if (!foundUser) {
        throw new ExtendedError("User not found", 404);
      }

      res.send(omit(foundUser.toJSON(), "password"));
    }
  );

  const all = asyncWrapper(async (req: Request, res: Response) => {
    const users = await allUsers();

    if (users.length === 0) {
      throw new ExtendedError("No users found", 404);
    }

    const sterilizedUsers = users.map((user) => {
      return omit(user.toJSON(), "password");
    });

    res.send(sterilizedUsers);
  });

  const currentUser = (req: Request, res: Response) => {
    res.send(res.locals.user);
  };

  return { create, update, remove, get, all, currentUser };
})();
export default userController;
