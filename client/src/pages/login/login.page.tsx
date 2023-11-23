import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "../../context/auth.provider";
import { useNavigate, useLocation } from "react-router-dom";
import { ExtendedError } from "../../types";

const schema = z.object({
  email: z.string().email({ message: "an email is required" }),
  password: z.string().min(4, { message: "a password is required" }),
});
type ValidationSchema = z.infer<typeof schema>;
export default function LoginPage() {
  const [loginError, setLoginError] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    formState,
  } = useForm<ValidationSchema>({ resolver: zodResolver(schema) });
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/home";
  useEffect(() => {
    if (formState.isSubmitSuccessful) {
      reset();
    }
  }, [formState, reset]);

  const onSubmit: SubmitHandler<ValidationSchema> = async ({
    email,
    password,
  }) => {
    try {
      await login({ email, password });
      navigate(from, { replace: true });
    } catch (error) {
      if (error instanceof ExtendedError) {
        if (error.statusCode === 401) {
          setLoginError(error.message);
          console.error(error);
          return;
        }
      }
      //some unknown error
      console.error(error);
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-xl font-bold mb-2">Login</h1>
      <div className="form-control w-full max-w-sm ">
        <input
          type="text"
          placeholder="email"
          {...register("email")}
          className="input input-bordered w-full max-w-sm"
        />
        <label className="label">
          {errors.email && (
            <span className="label-text-alt text-warning">
              {errors.email.message}
            </span>
          )}
        </label>
      </div>
      <div className="form-control w-full max-w-sm ">
        <input
          type="password"
          placeholder="password"
          {...register("password")}
          className="input input-bordered w-full max-w-sm"
        />
        <label className="label">
          {errors.password && (
            <span className="label-text-alt text-warning">
              {errors.password.message}
            </span>
          )}
        </label>
      </div>
      <p className="text-lg text-error">{loginError}</p>
      <button type="submit" className="btn btn-primary">
        log in
      </button>
    </form>
  );
}
