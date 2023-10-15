import { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { UseAuth } from "../../context/auth.provider";
import { useNavigate } from "react-router-dom";

const schema = z.object({
  email: z.string().email({ message: "an email is required" }),
  password: z.string().min(4, { message: "a password is required" }),
});
type ValidationSchema = z.infer<typeof schema>;
export default function LoginPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    formState,
  } = useForm<ValidationSchema>({ resolver: zodResolver(schema) });
  const { login, isAuthenticated } = UseAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (formState.isSubmitSuccessful) {
      reset();
    }
  }, [formState, reset]);

  useEffect(() => {
    (async () => {
      const auth = await isAuthenticated();
      if (auth) {
        navigate(-1);
      }
    })();
  }, [isAuthenticated, navigate]);

  const onSubmit: SubmitHandler<ValidationSchema> = async ({
    email,
    password,
  }) => {
    await login({ email, password }).then(() => {
      navigate("/home");
    });
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
      <button type="submit" className="btn btn-primary">
        log in
      </button>
    </form>
  );
}
