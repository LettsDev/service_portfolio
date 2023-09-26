import { Request, Response } from "express";
import { omit } from "lodash";
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
  async function create(
    req: Request<{}, {}, CreateUserInput["body"]>,
    res: Response
  ) {
    try {
      const user = await createUser(req.body);
      return res.send(omit(user.toJSON(), "password"));
    } catch (e: any) {
      return res.status(409).send(e.message);
    }
  }

  async function update(
    req: Request<UpdateUserInput["params"], {}, UpdateUserInput["body"]>,
    res: Response
  ) {
    try {
      const id = req.params.userId;
      const update = req.body;

      const foundUser = await findUser({ id });
      if (!!!foundUser) {
        return res.sendStatus(404);
      }
      const updatedUser = await updateUser({ _id: id }, update, {
        new: true,
      });
      if (updatedUser) {
        return res.send(omit(updatedUser.toJSON(), "password"));
      }
      throw Error("DB error updating the user");
    } catch (e: any) {
      console.log(e.message);
      return res.status(409).send(e.message);
    }
  }

  async function remove(
    req: Request<DeleteUserInput["params"]>,
    res: Response
  ) {
    try {
      const userId = req.params.userId;
      const foundUser = await findUser({ id: userId });
      if (!foundUser) {
        return res.sendStatus(404);
      }
      const deletedUser = await deleteUser({ _id: userId });
      if (deletedUser) {
        return res.send(omit(deletedUser.toJSON(), "password"));
      }
      throw Error("DB error deleting the user");
    } catch (e: any) {
      return res.status(409).send(e.message);
    }
  }

  async function get(req: Request<GetUserInput["params"]>, res: Response) {
    try {
      const userId = req.params.userId;

      const foundUser = await findUser({ id: userId });
      if (!foundUser) {
        return res.sendStatus(404);
      }
      return res.send(omit(foundUser.toJSON(), "password"));
    } catch (e: any) {
      return res.status(409).send(e.message);
    }
  }

  async function all(req: Request, res: Response) {
    try {
      const users = await allUsers();
      if (users.length === 0) {
        return res.sendStatus(404);
      }
      const sterilizedUsers = users.map((user) => {
        return omit(user.toJSON(), "password");
      });
      return res.send(sterilizedUsers);
    } catch (e: any) {
      return res.status(409).send(e.message);
    }
  }

  async function currentUser(req: Request, res: Response) {
    return res.send(res.locals.user);
  }

  return { create, update, remove, get, all, currentUser };
})();
export default userController;
