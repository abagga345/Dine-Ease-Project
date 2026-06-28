import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu as MenuIcon, ShoppingCart, X } from "lucide-react";
import toast from "react-hot-toast";
import { Container } from "../../common/ui/Container";
import { Button } from "../../common/ui/Button";
import { ConfirmModal } from "../../common/ui/Modal";
import { cn } from "../../common/ui/cn";
import { useCart } from "../../common/useCart";
import { brand } from "../../../config/brand";
import { CartDrawer } from "./CartDrawer";

interface NavLink {
  label: string;
  action: () => void;
}

function Brand({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex items-baseline gap-1.5 text-left">
      <span className="font-serif text-xl font-bold text-brand-maroon">{brand.name}</span>
      <span className="hidden text-xs font-semibold uppercase tracking-[0.25em] text-brand-terracotta sm:inline">
        {brand.wordmarkSuffix}
      </span>
    </button>
  );
}

function AppAppBar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false); // mobile drawer
  const [cartOpen, setCartOpen] = useState(false);
  const [logged, setLogged] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const { totalItems } = useCart();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setLogged(token !== null && token !== "");
  }, []);

  const handleLogout = () => {
    const toastId = toast.loading("Loading...", { id: "load-toast" });
    try {
      localStorage.setItem("token", "");
      localStorage.setItem("cart", "{}");
      localStorage.setItem("storeId", "");
      setLogged(false);
      setConfirmLogout(false);
      navigate("/");
      toast.dismiss(toastId);
      toast.success("Logged out successfully", { id: "logout-toast" });
    } catch (error: any) {
      toast.dismiss(toastId);
      toast.error(error.message);
    }
  };

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      const offset = 100;
      window.scrollTo({ top: el.offsetTop - offset, behavior: "smooth" });
    } else {
      navigate("/");
    }
    setOpen(false);
  };

  const go = (path: string) => () => {
    navigate(path);
    setOpen(false);
  };

  const links: NavLink[] = [
    { label: "Home", action: go("/") },
    { label: "Our Pickles", action: go("/menu") },
    { label: "Our Story", action: () => scrollToSection("story") },
    { label: "Stores", action: go("/store") },
    { label: "Dashboard", action: go("/dashboard") },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-brand-cream-dark/70 bg-brand-cream/90 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Brand onClick={go("/")} />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <button
              key={l.label}
              onClick={l.action}
              className="rounded-full px-3 py-2 text-sm font-medium text-brand-ink transition hover:bg-brand-maroon/10 hover:text-brand-maroon"
            >
              {l.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCartOpen(true)}
            aria-label="Open cart"
            className="relative rounded-full p-2 text-brand-maroon transition hover:bg-brand-maroon/10"
          >
            <ShoppingCart size={22} />
            {totalItems > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-turmeric px-1 text-xs font-bold text-brand-ink">
                {totalItems}
              </span>
            )}
          </button>

          <div className="hidden md:flex md:items-center md:gap-2">
            {!logged ? (
              <>
                <Button variant="ghost" size="sm" onClick={go("/signin")}>
                  Sign in
                </Button>
                <Button variant="primary" size="sm" onClick={go("/signup")}>
                  Sign up
                </Button>
              </>
            ) : (
              <Button variant="primary" size="sm" onClick={() => setConfirmLogout(true)}>
                Logout
              </Button>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            className="rounded-full p-2 text-brand-maroon transition hover:bg-brand-maroon/10 md:hidden"
          >
            {open ? <X size={22} /> : <MenuIcon size={22} />}
          </button>
        </div>
      </Container>

      {/* Mobile menu */}
      <div
        className={cn(
          "overflow-hidden border-t border-brand-cream-dark bg-brand-cream transition-all duration-300 md:hidden",
          open ? "max-h-96" : "max-h-0"
        )}
      >
        <Container className="flex flex-col gap-1 py-3">
          {links.map((l) => (
            <button
              key={l.label}
              onClick={l.action}
              className="rounded-lg px-3 py-2 text-left text-sm font-medium text-brand-ink transition hover:bg-brand-maroon/10"
            >
              {l.label}
            </button>
          ))}
          <div className="mt-2 flex gap-2">
            {!logged ? (
              <>
                <Button variant="outline" size="sm" fullWidth onClick={go("/signin")}>
                  Sign in
                </Button>
                <Button variant="primary" size="sm" fullWidth onClick={go("/signup")}>
                  Sign up
                </Button>
              </>
            ) : (
              <Button variant="primary" size="sm" fullWidth onClick={() => setConfirmLogout(true)}>
                Logout
              </Button>
            )}
          </div>
        </Container>
      </div>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <ConfirmModal
        open={confirmLogout}
        title="Are you sure?"
        message="You will be logged out of your account."
        confirmText="Logout"
        onConfirm={handleLogout}
        onCancel={() => setConfirmLogout(false)}
      />
    </header>
  );
}

export default AppAppBar;
