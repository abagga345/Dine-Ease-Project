import AppAppBar from "../Home/AppAppBar";
import Footer from "../Home/Footer";
import { SignupCard } from "./SignupCard";

export function UserSignup() {
  return (
    <div className="min-h-screen bg-brand-cream">
      <AppAppBar />
      <SignupCard />
      <Footer />
    </div>
  );
}
