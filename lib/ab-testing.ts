import { cookies, headers } from "next/headers";
import abExperiments from "../data/ab-experiments.json";

export type ABVariant = "A" | "B";

export interface ABExperiment {
  id: string;
  name: string;
  description: string;
  status: string;
  traffic_allocation: number;
  variants: {
    A: ABVariantConfig;
    B: ABVariantConfig;
  };
  cookie_name: string;
  cookie_duration_days: number;
}

export interface ABVariantConfig {
  name: string;
  button_color: string;
  button_text: string;
  description: string;
}

export async function getABVariant(experimentId: string): Promise<ABVariant> {
  const experiment = abExperiments.experiments[
    experimentId as keyof typeof abExperiments.experiments
  ] as ABExperiment;

  if (!experiment) {
    return "A"; // Default to control variant
  }

  // Try to get variant from headers first (set by middleware)
  const headersList = await headers();
  const variantFromHeader = headersList.get("x-ab-variant") as ABVariant;

  if (variantFromHeader && ["A", "B"].includes(variantFromHeader)) {
    return variantFromHeader;
  }

  // Fallback: check cookies directly
  const cookieStore = await cookies();
  const variantFromCookie = cookieStore.get(experiment.cookie_name)
    ?.value as ABVariant;

  if (variantFromCookie && ["A", "B"].includes(variantFromCookie)) {
    return variantFromCookie;
  }

  // Default fallback
  return "A";
}

export function getExperiment(experimentId: string): ABExperiment | null {
  return (
    (abExperiments.experiments[
      experimentId as keyof typeof abExperiments.experiments
    ] as ABExperiment) || null
  );
}

export function getVariantConfig(
  experimentId: string,
  variant: ABVariant
): ABVariantConfig | null {
  const experiment = getExperiment(experimentId);
  return experiment?.variants[variant] || null;
}
