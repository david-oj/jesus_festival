import { useSearchParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import DOMPurify from "dompurify";
import { AUTH_TOKEN_KEY } from "@/hooks/useAuthGuard";
import { sha256 } from "js-sha256";

interface LoginFormInputs {
  password: string;
}

const schema = yup
  .object({
    password: yup
      .string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(/^[a-zA-Z0-9!@#$%^&*]+$/, "No spaces or special chars allowed"),
  })
  .required();

const Login = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const from = searchParams.get("from") || "/dashboard";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: LoginFormInputs) => {
    const pwd = DOMPurify.sanitize(data.password);
    const hash = sha256(pwd);

    if (hash === import.meta.env.VITE_ADMIN_PASSWORD_HASH) {
      localStorage.setItem(AUTH_TOKEN_KEY, Date.now().toString());
      navigate(from, { replace: true });
    } else {
      alert("Incorrect password");
    }
  };

  return (
    <section className="mx-4 mt-20 ">
      <div className="max-w-md mx-auto p-8  bg-white/10 backdrop-blur-md rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4 text-center">Admin Login</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="password" className="block mb-1 font-medium">
              Enter Admin Password
            </label>
            <input
              type="password"
              id="password"
              {...register("password")}
              disabled={isSubmitting}
              className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring"
            />
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 text-white rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Login;
