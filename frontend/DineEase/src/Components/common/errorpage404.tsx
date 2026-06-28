import { useNavigate } from "react-router-dom";
import Footer from "../User/Home/Footer";
import AppAppBar from "../User/Home/AppAppBar";
import { Container } from "./ui/Container";
import { Button } from "./ui/Button";

interface InputProps {
  link: string;
}

export function ErrorPage404({ link }: InputProps) {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-brand-cream">
      <AppAppBar />
      <Container className="grid min-h-[60vh] place-items-center py-24 text-center">
        <div>
          <p className="font-serif text-base font-semibold text-brand-terracotta">404</p>
          <h1 className="mt-4 font-serif text-4xl font-bold text-brand-maroon sm:text-5xl">
            Page Not Found
          </h1>
          <p className="mx-auto mt-6 max-w-md text-brand-ink-soft">
            The page you&apos;re looking for doesn&apos;t exist or has been moved. Please check the
            URL or return to the homepage.
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
