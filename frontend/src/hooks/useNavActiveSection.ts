import { useEffect, useState } from "react";
import { NAV_ITEMS, SECTION_IDS, type SectionId } from "../constants/sections";

const LIVE_CLUSTER: string[] = [
  SECTION_IDS.liveDemo,
  "digital-twin",
  "voice-assistant",
];

export function useNavActiveSection(): SectionId {
  const [active, setActive] = useState<SectionId>(SECTION_IDS.home);

  useEffect(() => {
    const nodes = NAV_ITEMS.map((item) => ({
      id: item.id,
      el: document.getElementById(item.id),
    }));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible?.target?.id) return;
        const sid = visible.target.id;
        if (LIVE_CLUSTER.includes(sid)) {
          setActive(SECTION_IDS.liveDemo);
          return;
        }
        if (NAV_ITEMS.some((n) => n.id === sid)) {
          setActive(sid as SectionId);
        }
      },
      { rootMargin: "-32% 0px -38% 0px", threshold: [0, 0.12, 0.28, 0.5] }
    );

    const extra = ["digital-twin", "voice-assistant"]
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    [...nodes.map((n) => n.el).filter(Boolean), ...extra].forEach((el) => {
      observer.observe(el!);
    });

    return () => observer.disconnect();
  }, []);

  return active;
}
