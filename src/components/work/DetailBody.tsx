import { Container } from "@/components/ui/Container";
import { RichText } from "@/components/ui/RichText";
import { TechList } from "@/components/ui/TechChip";
import type { RichContent } from "@/lib/content";

/**
 * Write-up with a sticky tech-stack sidebar. Without a write-up, the stack
 * moves into the main column instead of floating next to empty space.
 */
export function DetailBody({
  body,
  bodyLabel,
  tech,
  stackLabel,
}: {
  body: RichContent | null;
  bodyLabel: string;
  tech: string[];
  stackLabel: string;
}) {
  if (!body && tech.length === 0) return null;

  const stack =
    tech.length > 0 ? (
      <>
        <h2 className="eyebrow">{stackLabel}</h2>
        <TechList items={tech} className="mt-4" />
      </>
    ) : null;

  if (!body) return <Container className="py-16 md:py-20">{stack}</Container>;

  return (
    <Container className="grid gap-12 py-16 md:py-20 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-16">
      <div className="max-w-[70ch]">
        <h2 className="eyebrow">{bodyLabel}</h2>
        <RichText content={body} className="mt-6 text-body" />
      </div>
      {stack ? (
        <aside className="lg:sticky lg:top-[calc(var(--header-height)+2rem)] lg:self-start">{stack}</aside>
      ) : null}
    </Container>
  );
}
