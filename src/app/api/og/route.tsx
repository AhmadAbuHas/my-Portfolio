import { ImageResponse } from "next/og";
import { getProfile, getSkills } from "@/lib/content";

// Default social share image, rendered once at build time. Uploading an image
// in Keystatic (Site settings) replaces it. English only: the OG renderer's
// Arabic text shaping is unreliable.
export const dynamic = "force-static";

const colors = {
  bg: "#0a0e15",
  border: "#232c3d",
  text: "#ecf0f6",
  muted: "#a3aec2",
  accent: "#c3f53c",
  accent2: "#4fd1e0",
};

async function loadGoogleFont(family: string, weight: number, text: string) {
  try {
    const url = `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, "+")}:wght@${weight}&text=${encodeURIComponent(text)}`;
    const css = await (await fetch(url)).text();
    const source = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1];
    if (!source) return null;
    const response = await fetch(source);
    return response.ok ? await response.arrayBuffer() : null;
  } catch {
    return null; // Offline build: fall back to the built-in font.
  }
}

export async function GET() {
  const [profile, skills] = await Promise.all([getProfile("en"), getSkills("en")]);
  const stack = skills
    .filter((group) => group.emphasis === "primary")
    .map((group) => group.items[0])
    .slice(0, 5)
    .join("  ·  ");

  const accentIndex = profile.headlineAccent ? profile.headline.indexOf(profile.headlineAccent) : -1;
  const headline =
    accentIndex === -1
      ? [profile.headline, "", ""]
      : [
          profile.headline.slice(0, accentIndex),
          profile.headlineAccent,
          profile.headline.slice(accentIndex + profile.headlineAccent.length),
        ];

  const glyphs = `AH.${profile.name}${profile.headline}${stack}Available for opportunities`;
  const [bold, medium] = await Promise.all([
    loadGoogleFont("Space Grotesk", 700, glyphs),
    loadGoogleFont("Space Grotesk", 500, glyphs),
  ]);
  const fonts = [
    bold && { name: "Space Grotesk", data: bold, weight: 700 as const, style: "normal" as const },
    medium && { name: "Space Grotesk", data: medium, weight: 500 as const, style: "normal" as const },
  ].filter((font) => font !== null);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          backgroundColor: colors.bg,
          backgroundImage: `radial-gradient(circle at 12% 0%, rgba(195,245,60,0.16), transparent 45%), radial-gradient(circle at 95% 30%, rgba(79,209,224,0.12), transparent 40%)`,
          fontFamily: fonts.length ? "Space Grotesk" : "sans-serif",
          color: colors.text,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", fontSize: 44, fontWeight: 700 }}>
            AH<span style={{ color: colors.accent }}>.</span>
          </div>
          {profile.openToWork ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "12px 24px",
                border: `2px solid ${colors.border}`,
                borderRadius: 999,
                fontSize: 24,
                fontWeight: 500,
                color: colors.text,
              }}
            >
              <div style={{ width: 12, height: 12, borderRadius: 999, backgroundColor: colors.accent }} />
              Available for opportunities
            </div>
          ) : null}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 104, fontWeight: 700, lineHeight: 1, letterSpacing: -2 }}>
            {profile.name}
          </div>
          <div style={{ display: "flex", marginTop: 24, fontSize: 48, fontWeight: 700, color: colors.text }}>
            {headline[0]}
            <span style={{ color: colors.accent, margin: "0 12px" }}>{headline[1]}</span>
            {headline[2]}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            paddingTop: 28,
            borderTop: `2px solid ${colors.border}`,
            fontSize: 28,
            fontWeight: 500,
            color: colors.muted,
          }}
        >
          {stack}
        </div>
      </div>
    ),
    { width: 1200, height: 630, fonts },
  );
}
