import { getCookie } from "@/lib/cookie";
import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async () => {
  const localeCookie = await getCookie("locale")
  const locale = localeCookie?.value || "en";

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
