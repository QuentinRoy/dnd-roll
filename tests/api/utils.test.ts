import { roll } from "../../api/utils";

describe("roll", () => {
  beforeEach(() => {
    jest.spyOn(global.Math, "random");
  });

  afterEach(() => {
    jest.spyOn(global.Math, "random").mockRestore();
  });

  test("generates random positive numbers using Math.random", () => {
    // @ts-ignore
    global.Math.random.mockReturnValueOnce((8 - 1) / 20);
    expect(roll(20)).toBe(8);

    // @ts-ignore
    global.Math.random.mockReturnValueOnce((18 - 1) / 100);
    expect(roll(100)).toBe(18);
  });

  test("returns highest value when Math.random() returns 0.9999999", () => {
    // @ts-ignore
    global.Math.random.mockReturnValue(0.99999999);
    expect(roll(100)).toBe(100);
    expect(roll(243)).toBe(243);
  });

  test("returns lowest value when Math.random() returns 0", () => {
    // @ts-ignore
    global.Math.random.mockReturnValue(0);
    expect(roll(100)).toBe(1);
    expect(roll(243)).toBe(1);
  });

  test("throws an error if max < 1", () => {
    expect(() => roll(-4)).toThrow();
    expect(() => roll(0)).toThrow();
  });
});
