import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "../../context/auth.provider";
import { useNavigate, useLocation } from "react-router-dom";
import { ExtendedError } from "../../types";
import { Link } from "react-router-dom";
import Loading from "../../components/loading";

const schema = z.object({
  email: z.string().email({ message: "an email is required" }),
  password: z.string().min(4, { message: "a password is required" }),
});
type ValidationSchema = z.infer<typeof schema>;
export default function LoginPage() {
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);
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
      setLoading(true);
      await login({ email, password });
      setLoading(false);
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
  const onSubmitSample = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    try {
      setLoading(true);
      await login({ email, password });
      setLoading(false);
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
    <div>
      <div className="flex md:justify-center md:items-center grow h-3/4">
        <form onSubmit={handleSubmit(onSubmit)} className="p-2 w-full max-w-md">
          <h1 className="text-3xl font-bold mb-4 cursor-default text-center mt-4">
            Login
          </h1>
          <div className="form-control w-full  ">
            <input
              type="text"
              placeholder="email"
              {...register("email")}
              className="input input-bordered w-full "
            />
            <label className="label">
              {errors.email && (
                <span className="label-text-alt text-warning">
                  {errors.email.message}
                </span>
              )}
            </label>
          </div>
          <div className="form-control w-full  ">
            <input
              type="password"
              placeholder="password"
              {...register("password")}
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
          <p className="text-lg text-error">{loginError}</p>
          <div className="flex justify-between items-end">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? <Loading /> : "log in"}
            </button>
            <Link to="/register" className="link">
              register new account
            </Link>
          </div>
          <div className="divider max-w-md py-4">or sample accounts</div>
        </form>
      </div>
      <div className="flex justify-center">
        <div className="flex gap-2 max-w-md ">
          <button
            className="btn btn-primary"
            disabled={loading}
            onClick={() =>
              onSubmitSample({
                email: "sample_admin@test.com",
                password: "sample123",
              })
            }
          >
            Admin
          </button>
          <button
            className="btn btn-secondary"
            disabled={loading}
            onClick={() =>
              onSubmitSample({
                email: "sample_enhance@test.com",
                password: "sample123",
              })
            }
          >
            Enhanced
          </button>
          <button
            className="btn btn-accent"
            disabled={loading}
            onClick={() =>
              onSubmitSample({
                email: "sample_user@test.com",
                password: "sample123",
              })
            }
          >
            User
          </button>
        </div>
      </div>
    </div>
  );
}
