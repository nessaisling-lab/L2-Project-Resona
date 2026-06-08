import { describe, it, expect } from "vitest";
import { reviewLocal, removeFillers, scoreWriting } from "./grammar";

describe("removeFillers", () => {
  it("strips common fillers and tidies the seams", () => {
    const r = removeFillers("So, um, I basically think, you know, it works");
    const low = r.cleaned.toLowerCase();
    expect(low).not.toContain("um");
    expect(low).not.toContain("basically");
    expect(low).not.toContain("you know");
    expect(r.removed).toBeGreaterThanOrEqual(3);
    expect(r.byType["basically"]).toBe(1);
    // No doubled spaces or orphaned commas left behind.
    expect(r.cleaned).not.toMatch(/\s{2,}/);
    expect(r.cleaned).not.toMatch(/,\s*,/);
  });

  it("does NOT touch meaningful words like 'like' or 'actually'", () => {
    expect(removeFillers("I like coffee").cleaned).toBe("I like coffee");
    expect(removeFillers("I like coffee").removed).toBe(0);
    expect(removeFillers("It actually worked").removed).toBe(0);
  });

  it("counts each filter type", () => {
    const r = removeFillers("um uh um, you know, kind of done");
    expect(r.byType["um/uh"]).toBe(3);
    expect(r.byType["you know"]).toBe(1);
    expect(r.byType["sort of/kind of"]).toBe(1);
  });
});

describe("scoreWriting", () => {
  it("returns 0 for empty text", () => {
    expect(scoreWriting("").overall).toBe(0);
    expect(scoreWriting("   ").words).toBe(0);
  });

  it("scores clean prose highly", () => {
    const s = scoreWriting("The report is ready. Please review it.");
    expect(s.overall).toBeGreaterThan(70);
    expect(s.words).toBe(7);
    expect(s.sentences).toBe(2);
  });

  it("penalizes conciseness when fillers are dense", () => {
    const clean = scoreWriting("The plan works well.");
    const noisy = scoreWriting("Um, so basically, you know, um, it is, uh, done.");
    const conc = (x: ReturnType<typeof scoreWriting>) =>
      x.metrics.find((m) => m.label === "Conciseness")!.score;
    expect(noisy.fillerCount).toBeGreaterThanOrEqual(3);
    expect(conc(noisy)).toBeLessThan(conc(clean));
  });

  it("keeps every metric in 0..100", () => {
    for (const m of scoreWriting("This is a reasonably normal sentence to score.").metrics) {
      expect(m.score).toBeGreaterThanOrEqual(0);
      expect(m.score).toBeLessThanOrEqual(100);
    }
  });
});

describe("reviewLocal (existing behavior)", () => {
  it("capitalizes 'I', fixes sentence starts, adds closing punctuation", () => {
    const r = reviewLocal("i went to the store i bought milk");
    expect(r.fixed).toMatch(/\bI\b/);
    expect(r.fixed.endsWith(".")).toBe(true);
    expect(r.score).toBeGreaterThan(0);
    expect(r.score).toBeLessThanOrEqual(100);
  });
});
