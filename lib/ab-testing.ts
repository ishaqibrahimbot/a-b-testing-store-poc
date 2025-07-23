import { cookies, headers } from "next/headers";

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
  button_color?: string;
  button_text?: string;
  layout_type?: string;
  description: string;
}

// Base URL for local data server
const DATA_SERVER_URL = process.env.DATA_SERVER_URL || "http://localhost:3001";

async function getExperiments() {
  try {
    const res = await fetch(`${DATA_SERVER_URL}/experiments`);

    if (!res.ok) {
      throw new Error(`Failed to fetch experiments: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching experiments:", error);
    return null;
  }
}

export async function getABVariant(experimentId: string): Promise<ABVariant> {
  const abExperiments = await getExperiments();

  if (!abExperiments) {
    return "A"; // Default to control variant
  }

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

export async function getExperiment(
  experimentId: string
): Promise<ABExperiment | null> {
  const abExperiments = await getExperiments();

  if (!abExperiments) {
    return null;
  }

  return (
    (abExperiments.experiments[
      experimentId as keyof typeof abExperiments.experiments
    ] as ABExperiment) || null
  );
}

export async function getVariantConfig(
  experimentId: string,
  variant: ABVariant
): Promise<ABVariantConfig | null> {
  const experiment = await getExperiment(experimentId);
  return experiment?.variants[variant] || null;
}

export async function getLayoutVariant(): Promise<ABVariant> {
  const abExperiments = await getExperiments();

  if (!abExperiments) {
    return "A"; // Default to control variant
  }

  const experiment = abExperiments.experiments[
    "product-layout"
  ] as ABExperiment;

  if (!experiment) {
    return "A"; // Default to control variant
  }

  // Try to get variant from headers first (set by middleware)
  const headersList = await headers();
  const variantFromHeader = headersList.get("x-ab-layout-variant") as ABVariant;

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

export async function getExperimentConfig(
  experimentId: string
): Promise<ABExperiment | null> {
  const abExperiments = await getExperiments();

  if (!abExperiments) {
    return null;
  }

  const experiment = abExperiments.experiments[
    experimentId as keyof typeof abExperiments.experiments
  ] as ABExperiment;

  return experiment || null;
}
