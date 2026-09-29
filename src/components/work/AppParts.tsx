import Image from "next/image";
import { Globe } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { BrandIcon, storeIcons } from "@/components/icons";
import { Badge } from "@/components/ui/Badge";
import type { AppStatus, AppSummary } from "@/lib/content";
import { cn } from "@/lib/cn";

/** Squircle app icon. Decorative (alt="") because the app name is always next to it. */
export function AppIcon({ src, name, className }: { src: string | null; name: string; className?: string }) {
  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-[22%] border border-border bg-surface-2",
        className,
      )}
    >
      {src ? (
        <Image src={src} alt="" fill sizes="128px" className="object-cover" />
      ) : (
        <span
          aria-hidden="true"
          className="absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_30%_20%,color-mix(in_oklab,var(--accent)_22%,transparent),transparent_70%)] font-display text-2xl font-bold text-accent"
        >
          {name.slice(0, 1)}
        </span>
      )}
    </div>
  );
}

const statusTone: Record<AppStatus, "accent" | "neutral" | "subtle"> = {
  live: "accent",
  beta: "neutral",
  "in-development": "neutral",
  archived: "subtle",
};

/** Status + platform badges (text labels, never color alone). */
export async function AppBadges({ app, className }: { app: AppSummary; className?: string }) {
  const t = await getTranslations("apps");
  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      <Badge tone={statusTone[app.status]} dot={app.status === "live"}>
        {t(`status.${app.status}`)}
      </Badge>
      {app.platforms.map((platform) => (
        <Badge key={platform} tone="subtle">
          {t(`platforms.${platform}`)}
        </Badge>
      ))}
    </div>
  );
}

const storeLink =
  "inline-flex min-h-11 items-center gap-2 rounded-full border border-border-input px-4 text-small font-medium text-fg transition-colors duration-150 hover:border-fg-muted hover:bg-surface-2";

/** App Store / Google Play / web links. Renders nothing when there are none. */
export async function StoreLinks({ app, className }: { app: AppSummary; className?: string }) {
  const t = await getTranslations();
  const newTab = <span className="sr-only">{t("common.opensInNewTab")}</span>;
  if (!app.appStoreUrl && !app.playStoreUrl && !app.webUrl) return null;

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {app.appStoreUrl ? (
        <a href={app.appStoreUrl} target="_blank" rel="noreferrer" className={storeLink}>
          <BrandIcon icon={storeIcons.appStore} className="size-4" />
          {t("apps.appStore")}
          {newTab}
        </a>
      ) : null}
      {app.playStoreUrl ? (
        <a href={app.playStoreUrl} target="_blank" rel="noreferrer" className={storeLink}>
          <BrandIcon icon={storeIcons.googlePlay} className="size-4" />
          {t("apps.googlePlay")}
          {newTab}
        </a>
      ) : null}
      {app.webUrl ? (
        <a href={app.webUrl} target="_blank" rel="noreferrer" className={storeLink}>
          <Globe aria-hidden="true" className="size-4" />
          {t("apps.openWebApp")}
          {newTab}
        </a>
      ) : null}
    </div>
  );
}
