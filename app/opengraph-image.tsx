import { ImageResponse } from "next/og";
import { SocialCard } from "./social-card";

export const alt = "SpendPilot AI";
export const contentType = "image/png";
export const runtime = "edge";
export const size = {
  width: 1200,
  height: 630
};

export default function OpenGraphImage() {
  return new ImageResponse(<SocialCard />, {
    ...size
  });
}
