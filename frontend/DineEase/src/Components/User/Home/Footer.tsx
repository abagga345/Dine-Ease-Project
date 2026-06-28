import { useNavigate } from "react-router-dom";
import { Instagram, Facebook, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { Container } from "../../common/ui/Container";
import { brand } from "../../../config/brand";

const socialIcons = [
  { key: "instagram", Icon: Instagram, href: brand.social.instagram },
  { key: "facebook", Icon: Facebook, href: brand.social.facebook },
  { key: "twitter", Icon: Twitter, href: brand.social.twitter },
  { key: "youtube", Icon: Youtube, href: brand.social.youtube },
].filter((s) => s.href);

function FooterColumn({
  title,
  links,
  onNavigate,
}: {
  title: string;
  links: ReadonlyArray<{ label: string; href: string }>;
  onNavigate: (href: string) => void;
}) {
  return (
    <div>
      <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-brand-turmeric">
        {title}
      </h4>
      <ul className="space-y-2">
        {links.map((l) => (
          <li key={l.label}>
            <button
              onClick={() => onNavigate(l.href)}
              className="text-sm text-brand-cream/80 transition hover:text-brand-cream"
            >
              {l.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  const navigate = useNavigate();
  const onNavigate = (href: string) => {
    if (href.startsWith("/")) navigate(href);
  };

  return (
    <footer className="bg-brand-maroon-dark text-brand-cream">
      <Container className="py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand blurb */}
          <div className="lg:col-span-2">
            <p className="font-serif text-2xl font-bold">
              {brand.name}{" "}
              <span className="text-base font-normal text-brand-turmeric">
                {brand.wordmarkSuffix}
              </span>
            </p>
            <p className="mt-3 max-w-sm text-sm text-brand-cream/80">{brand.tagline}</p>
            <ul className="mt-5 space-y-2 text-sm text-brand-cream/80">
              <li className="flex items-center gap-2">
                <Mail size={15} /> {brand.contact.email}
              </li>
              <li className="flex items-center gap-2">
                <Phone size={15} /> {brand.contact.phone}
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={15} /> {brand.contact.address}
              </li>
            </ul>
            {socialIcons.length > 0 && (
              <div className="mt-5 flex gap-3">
                {socialIcons.map(({ key, Icon, href }) => (
                  <a
                    key={key}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={key}
                    className="rounded-full bg-brand-cream/10 p-2 transition hover:bg-brand-turmeric hover:text-brand-ink"
                  >
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            )}
          </div>

          <FooterColumn title="Shop" links={brand.footerLinks.shop} onNavigate={onNavigate} />
          <FooterColumn title="Company" links={brand.footerLinks.company} onNavigate={onNavigate} />
          <FooterColumn title="Legal" links={brand.footerLinks.legal} onNavigate={onNavigate} />
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-brand-cream/20 pt-6 text-sm text-brand-cream/70 sm:flex-row">
          <p>
            © {brand.sinceYear}–{new Date().getFullYear()} {brand.name}. All rights reserved.
          </p>
          <p className="text-brand-cream/60">Crafted with tradition • Made in India</p>
        </div>
      </Container>
    </footer>
  );
}
