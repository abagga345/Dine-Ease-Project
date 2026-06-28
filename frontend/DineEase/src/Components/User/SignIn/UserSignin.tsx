import AppAppBar from "../Home/AppAppBar";
import Footer from "../Home/Footer";
import { SigninCard } from "./SigninCard";

export function UserSignin() {
  return (
    <div className="min-h-screen bg-brand-cream">
      <AppAppBar />
      <SigninCard />
      <Footer />
    </div>
  );
}
