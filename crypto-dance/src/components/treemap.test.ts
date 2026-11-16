import { describe, expect, test } from "bun:test";
import { formatPrice } from "./CryptoDanceVisualization";

describe("formatPrice", () => {
  test("formats large prices with two decimals", () => {
    expect(formatPrice(80657.45)).toBe("80,657.45");
    expect(formatPrice(1541.1)).toBe("1,541.10");
  });

  test("formats stablecoin prices with two decimals", () => {
    expect(formatPrice(1.0007)).toBe("1.00");
    expect(formatPrice(0.12)).toBe("0.12");
  });

  test("keeps sub-dollar prices visible", () => {
    expect(formatPrice(0.156694)).toBe("0.156694");
    expect(formatPrice(0.041)).toBe("0.041");
  });

  test("keeps micro prices visible", () => {
    expect(formatPrice(0.00001637)).toBe("0.00001637");
    expect(formatPrice(0.000008)).toBe("0.000008");
  });
});
