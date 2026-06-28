import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { Input } from "../../common/ui/Input";
import { Button } from "../../common/ui/Button";
import { apiUrl } from "../../../config/api";
import { brand, heroImages } from "../../../config/brand";

interface SigninresultSuccess {
  token: string;
  message: string;
}

interface FormFields {
  email: string;
  password: string;
}

export function SigninCard() {
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>();
  const navigate = useNavigate();

  async function submithandler(data: FormFields) {
    const result = await fetch(apiUrl("user/signin"), {
      method: "POST",
      body: JSON.stringify({ email: data.email, password: data.password }),
      headers: { "content-type": "application/json" },
    });
    if (result.ok) {
      const body: SigninresultSuccess = await result.json();
      localStorage.setItem("token", body["token"]);
      navigate("/home");
      return;
    }
    const err: { message: string } = await result.json();
    setError(err.message);
  }

  return (
    <div className="flex justify-center px-4 py-12">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-3xl border border-brand-cream-dark bg-white shadow-card md:grid-cols-2">
        {/* Form */}
        <div className="flex flex-col justify-center p-8 sm:p-12">
          <div className="mb-8 text-center">
            <p className="font-serif text-2xl font-bold text-brand-maroon">{brand.name}</p>
            <h2 className="mt-6 font-serif text-2xl font-bold text-brand-ink">Welcome back</h2>
            <p className="mt-1 text-sm text-brand-ink-soft">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit(submithandler)} className="space-y-4">
            <Input
              label="Email"
              type="text"
              autoComplete="email"
              icon={<Mail size={16} />}
              error={errors.email?.message}
              {...register("email", {
                minLength: { value: 4, message: "Email too short" },
                maxLength: { value: 30, message: "Email too large" },
              })}
            />
            <Input
              label="Password"
              type="password"
              autoComplete="current-password"
              icon={<Lock size={16} />}
              error={errors.password?.message}
              {...register("password", {
                minLength: { value: 5, message: "Password too short" },
                maxLength: { value: 30, message: "Password too large" },
              })}
            />

            {error && <p className="text-center text-sm text-red-600">{error}</p>}

            <Button type="submit" fullWidth size="lg" loading={isSubmitting}>
              Sign in
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-brand-ink-soft">
            Don&apos;t have an account?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="font-semibold text-brand-maroon hover:underline"
            >
              Sign up
            </button>
          </p>
        </div>

        {/* Image */}
        <div className="hidden bg-brand-cream md:block">
          <img src={heroImages.hero} alt="" className="h-full w-full object-cover" />
        </div>
      </div>
    </div>
  );
}
