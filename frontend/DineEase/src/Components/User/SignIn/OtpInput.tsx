import { useState } from "react";
import { OtpInput } from "../../common/ui/OtpInput";

/** Standalone OTP route handler (kept for the /verifyotp route). */
export const OtpHandler = () => {
  const [value, setValue] = useState<string>("");

  return (
    <div className="mx-auto mt-10 max-w-sm px-4">
      <OtpInput value={value} onChange={setValue} length={6} />
    </div>
  );
};
