import { getTranslations } from "next-intl/server";
import Link from "next/link";

export default async function Footer() {
  const t = await getTranslations("footer");

  return (
    <div className="px-12 text-sm py-4 text-foreground/70">
      <p>
        {t("description")}{" "}
        <Link
          href="https://github.com/luccasfr"
          target="_blank"
          className="text-foreground hover:underline underline-offset-3"
        >
          Lucas Ferreira
        </Link>
      </p>
    </div>
  );
}
