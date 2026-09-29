import { SpotlightCard } from "@/components/motion/SpotlightCard";
import { LocaleLink } from "@/components/ui/LocaleLink";
import type { AppSummary } from "@/lib/content";
import { AppBadges, AppIcon, StoreLinks } from "./AppParts";
import { stretchedLink } from "./ProjectCard";

export function AppCard({ app }: { app: AppSummary }) {
  return (
    <SpotlightCard className="group flex h-full flex-col gap-5 rounded-xl border border-border bg-surface p-6 transition-colors duration-250 md:p-7">
      <div className="flex items-start gap-4">
        <AppIcon src={app.icon} name={app.name} className="size-16" />
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-xl font-semibold text-balance text-fg">
            <LocaleLink href={`/apps/${app.slug}`} className={stretchedLink}>
              {app.name}
            </LocaleLink>
          </h3>
          <AppBadges app={app} className="mt-2" />
        </div>
      </div>
      <p className="text-pretty text-fg-muted">{app.summary}</p>
      {/* Above the stretched link so the store buttons stay clickable. */}
      <StoreLinks app={app} className="relative z-20 mt-auto" />
    </SpotlightCard>
  );
}
