import { useNavigate } from "react-router-dom";
import Footer from "../User/Home/Footer";
import AppAppBar from "../User/Home/AppAppBar";
import { Container } from "./ui/Container";
import { Button } from "./ui/Button";

interface InputProps {
  link: string;
}

export function ErrorPage500({ link }: InputProps) {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-brand-cream">
      <AppAppBar />
      <Container className="grid min-h-[60vh] place-items-center py-24 text-center">
        <div>
          <p className="font-serif text-base font-semibold text-brand-terracotta">500</p>
          <h1 className="mt-4 font-serif text-4xl font-bold text-brand-maroon sm:text-5xl">
            Internal Server Error
          </h1>
          <p className="mx-auto mt-6 max-w-md text-brand-ink-soft">
            Something went wrong on our end. Please try again later or contact us if the problem
            persists.
          </p>
          <Button className="mt-10" size="lg" onClick={() => navigate(link)}>
            Go back home
          </Button>
        </div>
      </Container>
      <Footer />
    </div>
  );
}
