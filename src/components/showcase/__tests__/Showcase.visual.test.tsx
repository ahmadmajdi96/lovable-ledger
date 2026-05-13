import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import HeroSection from "../HeroSection";
import SystemArchitecture from "../SystemArchitecture";
import BenefitsSection from "../BenefitsSection";
import IndustryStandards from "../IndustryStandards";
import Footer from "../Footer";
import ModuleShowcase from "../ModuleShowcase";

/**
 * Visual regression tests — snapshot the rendered DOM of every showcase
 * section. If any section's structure, copy, image asset, or routing
 * changes unintentionally, the snapshot diff will catch it.
 *
 * To intentionally update after a real change, run:
 *   bun run test -- -u
 */
const wrap = (node: React.ReactNode) => (
  <MemoryRouter>
    <div className="pp-dark">{node}</div>
  </MemoryRouter>
);

describe("Landing showcase visual regression", () => {
  it("HeroSection markup is stable", () => {
    const { container } = render(wrap(<HeroSection />));
    expect(container.firstChild).toMatchSnapshot();
  });

  it("HeroSection still references the hero background asset", () => {
    const { container } = render(wrap(<HeroSection />));
    const html = container.innerHTML;
    expect(html).toMatch(/hero-corta-bg/);
  });

  it("SystemArchitecture markup is stable", () => {
    const { container } = render(wrap(<SystemArchitecture />));
    expect(container.firstChild).toMatchSnapshot();
  });

  it("ModuleShowcase markup is stable", () => {
    const { container } = render(wrap(<ModuleShowcase />));
    expect(container.firstChild).toMatchSnapshot();
  });

  it("BenefitsSection markup is stable", () => {
    const { container } = render(wrap(<BenefitsSection />));
    expect(container.firstChild).toMatchSnapshot();
  });

  it("IndustryStandards markup is stable", () => {
    const { container } = render(wrap(<IndustryStandards />));
    expect(container.firstChild).toMatchSnapshot();
  });

  it("Footer markup is stable", () => {
    const { container } = render(wrap(<Footer />));
    expect(container.firstChild).toMatchSnapshot();
  });
});
