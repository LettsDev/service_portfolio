import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { useAuth } from "../../context/auth.provider";
import { useAlert } from "../../context/alert.provider";
import { ExtendedError } from "../../types";
const schema = z
  .object({
    email: z.string().email({ message: "an email is required" }),
    first_name: z.string().min(1, { message: "a first name is required" }),
    last_name: z.string().min(1, { message: "a last name is required" }),
    password: z.string().min(4, { message: "a password is required" }),
    passwordConfirmation: z
      .string()
      .min(4, { message: "the passwords must match" }),
    auth: z.string(),
  })
  .superRefine(({ password, passwordConfirmation, auth }, ctx) => {
    if (password !== passwordConfirmation) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords do not match.",
        path: ["passwordConfirmation"],
      });
    }
    if (auth !== "USER" && auth !== "ENHANCED" && auth !== "ADMIN") {
      ctx.addIssue({
        code: "custom",
        message: "A level of authority is required.",
        path: ["auth"],
      });
    }
  });
type ValidationSchema = z.infer<typeof schema>;

export default function Register() {
  const { registerUser } = useAuth();
  const { addAlert } = useAlert();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    formState,
  } = useForm<ValidationSchema>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (formState.isSubmitSuccessful) {
      reset();
    }
  }, [formState, reset]);

  const submitHandler: SubmitHandler<ValidationSchema> = async ({
    email,
    password,
    passwordConfirmation,
    first_name,
    last_name,
    auth,
  }) => {
    try {
      await registerUser({
        email,
        password,
        first_name,
        last_name,
        passwordConfirmation,
        auth,
      });
      addAlert({
        type: "success",
        message: "successfully created a new account",
      });
      navigate("/login");
    } catch (error) {
      console.error(error);

      addAlert({
        type: "error",
        error:
          error instanceof ExtendedError
            ? error.message
            : "There was an internal error processing your request. Please try refreshing the page.",
      });
      return;
    }
  };

  return (
    <main className="flex md:justify-center md:items-center grow h-3/4">
      <form
        onSubmit={handleSubmit(submitHandler)}
        className="p-2 w-full max-w-md"
      >
        <h1 className="text-xl font-bold mb-4">Register</h1>

        <div className="form-control">
          <input
            type="text"
            {...register("first_name")}
            id="first_name"
            placeholder="first name"
            className="input input-bordered "
          />
          <label className="label">
            {errors.first_name && (
              <span className="label-text-alt text-warning">
                {errors.first_name.message}
              </span>
            )}
          </label>
        </div>
        <div className="form-control">
          <input
            type="text"
            {...register("last_name")}
            id="last_name"
            placeholder="last name"
            className="input input-bordered "
          />
          <label className="label">
            {errors.last_name && (
              <span className="label-text-alt text-warning">
                {errors.last_name.message}
              </span>
            )}
          </label>
        </div>

        <div className="form-control w-">
          <input
            type="email"
            {...register("email")}
            id="email"
            placeholder="email"
            className="input input-bordered "
          />
          <label className="label">
            {errors.email && (
              <span className="label-text-alt text-warning">
                {errors.email.message}
              </span>
            )}
          </label>
        </div>
        <div className="form-control">
          <select
            className="select select-bordered"
            {...register("auth")}
            defaultValue={1}
          >
            <option value="1" disabled>
              Please choose a level of authority
            </option>
            <option value="USER">User</option>
            <option value="ENHANCED">Enhanced</option>
            <option value="ADMIN">Administrator</option>
          </select>
          <label className="label">
            {errors.auth && (
              <span className="label-text-alt text-warning">
                {errors.auth.message}
              </span>
            )}
          </label>
        </div>
        <div className="form-control w-full ">
          <input
            type="password"
            {...register("password")}
            id="password"
            placeholder="password"
            className="input input-bordered w-full "
          />
          <label className="label">
            {errors.password && (
              <span className="label-text-alt text-warning">
                {errors.password.message}
              </span>
            )}
          </label>
        </div>
        <div className="form-control w-full ">
          <input
            type="password"
            {...register("passwordConfirmation")}
            id="passwordConfirmation"
            placeholder="confirm password"
            className="input input-bordered w-full "
          />
          <label className="label">
            {errors.passwordConfirmation && (
              <span className="label-text-alt text-warning">
                {errors.passwordConfirmation.message}
              </span>
            )}
          </label>
        </div>
        <div className="flex w-full gap-1">
          <button type="submit" className="btn  btn-primary grow">
            Submit
          </button>
          <Link to="/login" className="btn  btn-secondary grow">
            Cancel
          </Link>
        </div>
      </form>
    </main>
  );
}
