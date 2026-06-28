import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CircleCheck, CircleX, Mail, Lock, User, Phone } from "lucide-react";
import { Input } from "../../common/ui/Input";
import { Button } from "../../common/ui/Button";
import { OtpInput } from "../../common/ui/OtpInput";
import { apiUrl } from "../../../config/api";
import { brand, heroImages } from "../../../config/brand";

interface SignupresultSuccess {
  token: string;
  message: string;
}

interface FormFields {
  firstName: string;
  lastName: string;
  contactNo: string;
  email: string;
  password: string;
  confirmpassword: string;
}

export function SignupCard() {
  const [error, setError] = useState("");
  const [verified, setVerified] = useState(false);
  const [Otpphase, setOtpPhase] = useState(false);
  const [loading1, setLoading1] = useState(false); // verify otp
  const [loading2, setLoading2] = useState(false); // resend otp
  const [loading3, setLoading3] = useState(false); // verify email (send)
  const [value, setValue] = useState("");
  const [Otpmsg, setOtpMsg] = useState("");
  const [timer, setTimer] = useState(0);
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>();
  const email = watch("email");
  const navigate = useNavigate();

  useEffect(() => {
    let interval: number | NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  async function sendOtpHandler() {
    let result = await axios.post(apiUrl("user/generateotp"), { email });
    if (result.status === 200) setOtpMsg("OTP sent successfully");
    else setOtpMsg("Some Error Occurred , Please retry");
    setLoading2(false);
    setLoading3(false);
    setTimer(60);
  }

  async function verifyOtpHandler() {
    try {
      let result = await axios.put(apiUrl("user/verifyotp"), { email, otp: value });
      if (result.status === 200) {
        setVerified(true);
        setLoading1(false);
      } else {
        setLoading1(false);
        setOtpMsg("Invalid OTP");
      }
    } catch (error) {
      setOtpMsg("Invalid OTP");
      setLoading1(false);
    }
  }

  async function submithandler(data: FormFields) {
    if (data.password != data.confirmpassword) {
      setError("Password not same as confirm password");
      return;
    }
    const result = await fetch(apiUrl("user/signup"), {
      method: "POST",
      body: JSON.stringify({
        firstName: data.firstName,
        lastName: data.lastName,
        contactNo: data.contactNo,
        email: data.email,
        password: data.password,
      }),
      headers: { "content-type": "application/json" },
    });
    if (result.ok) {
      const body: SignupresultSuccess = await result.json();
      localStorage.setItem("token", body["token"]);
      navigate("/home");
      return;
    }
    const err: { message: string } = await result.json();
    setError(err.message);
  }

  const showDetails = !Otpphase || verified;

  return (
    <div className="flex justify-center px-4 py-12">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-3xl border border-brand-cream-dark bg-white shadow-card md:grid-cols-2">
        {/* Image */}
        <div className="hidden bg-brand-cream md:block">
          <img src={heroImages.story} alt="" className="h-full w-full object-cover" />
        </div>

        {/* Form */}
        <div className="flex flex-col justify-center p-8 sm:p-12">
          <div className="mb-6 text-center">
            <p className="font-serif text-2xl font-bold text-brand-maroon">{brand.name}</p>
            <h2 className="mt-4 font-serif text-2xl font-bold text-brand-ink">Create your account</h2>
          </div>

          <form onSubmit={handleSubmit(submithandler)} className="space-y-4">
            {showDetails && (
              <div className="flex gap-4">
                <Input
                  label="First Name"
                  type="text"
                  required
                  icon={<User size={16} />}
                  {...register("firstName")}
                />
                <Input label="Last Name" type="text" required {...register("lastName")} />
              </div>
            )}

            {showDetails && (
              <Input
                label="Contact Number"
                type="text"
                required
                icon={<Phone size={16} />}
                error={errors.contactNo?.message}
                {...register("contactNo", {
                  validate: (value) => {
                    if (value.length != 10) return "Contact number must be 10 digits";
                    for (let i = 0; i < value.length; i++) {
                      if (value[i] >= "0" && value[i] <= "9") continue;
                      return "Contact number is invalid";
                    }
                    return true;
                  },
                })}
              />
            )}

            {/* Email + verification badge */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label htmlFor="email" className="text-sm font-medium text-brand-ink">
                  Email
                </label>
                {verified ? (
                  <span className="flex items-center gap-1 text-sm text-green-600">
                    Verified <CircleCheck size={16} />
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-sm text-brand-ink-soft">
                    Unverified <CircleX size={16} />
                  </span>
                )}
              </div>
              <Input
                id="email"
                type="text"
                required
                disabled={Otpphase || verified}
                icon={<Mail size={16} />}
                error={errors.email?.message}
                {...register("email", {
                  minLength: { value: 4, message: "Email too short" },
                  maxLength: { value: 30, message: "Email too large" },
                })}
              />
            </div>

            {/* OTP phase */}
            {Otpphase && !verified && (
              <div className="rounded-xl border border-brand-cream-dark bg-brand-cream p-4">
                <p className="mb-3 text-center text-sm text-brand-ink-soft">
                  Enter the 6-digit code sent to your email
                </p>
                <OtpInput value={value} onChange={setValue} length={6} />
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  <Button
                    type="button"
                    size="sm"
                    loading={loading1}
                    onClick={() => {
                      setLoading1(true);
                      verifyOtpHandler();
                    }}
                  >
                    Verify OTP
                  </Button>
                  {timer > 0 ? (
                    <Button type="button" size="sm" variant="outline" disabled>
                      Resend in {timer}s
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      loading={loading2}
                      onClick={() => {
                        setLoading2(true);
                        sendOtpHandler();
                      }}
                    >
                      Resend OTP
                    </Button>
                  )}
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setOtpPhase(false);
                      setLoading3(false);
                      setLoading2(false);
                      setLoading1(false);
                    }}
                  >
                    Back
                  </Button>
                </div>
                {Otpmsg && (
                  <p className="mt-3 text-center text-sm text-red-600">{Otpmsg}</p>
                )}
              </div>
            )}

            {/* Password fields (after verification) */}
            {verified && (
              <>
                <Input
                  label="Password"
                  type="password"
                  required
                  icon={<Lock size={16} />}
                  error={errors.password?.message}
                  {...register("password", {
                    minLength: { value: 5, message: "Password too short" },
                    maxLength: { value: 30, message: "Password too large" },
                  })}
                />
                <Input
                  label="Confirm Password"
                  type="password"
                  required
                  icon={<Lock size={16} />}
                  {...register("confirmpassword", {
                    minLength: { value: 5, message: "Password too short" },
                    maxLength: { value: 30, message: "Password too large" },
                  })}
                />
              </>
            )}

            {error && <p className="text-center text-sm text-red-600">{error}</p>}

            {/* Verify email button (before OTP phase) */}
            {!Otpphase && !verified && (
              <Button
                type="button"
                fullWidth
                size="lg"
                loading={loading3}
                onClick={() => {
                  setLoading3(true);
                  setOtpPhase(true);
                  sendOtpHandler();
                }}
              >
                Verify Email
              </Button>
            )}

            {/* Final submit */}
            {verified && (
              <Button type="submit" fullWidth size="lg" loading={isSubmitting}>
                Sign up
              </Button>
            )}
          </form>

          <p className="mt-8 text-center text-sm text-brand-ink-soft">
            Have an account?{" "}
            <button
              onClick={() => navigate("/signin")}
              className="font-semibold text-brand-maroon hover:underline"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
