import { parseSearchParamsToObject, pick, omit } from "$lib/utils/index.js";
import { describe, it, expect } from "vitest";

describe("Utils", () => {
  describe("parseSearchParamsToObject", () => {
    it("should parse search parameters to an object", () => {
      const searchParams = "?param1=value1&param2=value2";
      const expectedOutput = {
        authUrlParams: {
          param1: "value1",
          param2: "value2",
        },
      };

      const output = parseSearchParamsToObject(searchParams);

      expect(output).toEqual(expectedOutput);
    });
  });

  describe("pick", () => {
    it("should pick specified properties from an object", () => {
      const obj = { a: 1, b: 2, c: 3 };
      const keys = ["a", "c"];
      const expectedOutput = { a: 1, c: 3 };

      const output = pick(obj, keys);

      expect(output).toEqual(expectedOutput);
    });
  });

  describe("omit", () => {
    it("should omit specified properties from an object", () => {
      const obj = { a: 1, b: 2, c: 3 };
      const keys = ["a", "c"];
      const expectedOutput = { b: 2 };

      const output = omit(obj, keys);

      expect(output).toEqual(expectedOutput);
    });
  });
});
