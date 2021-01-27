import mitt from "next/dist/next-server/lib/mitt";
import { solveDiceThrow, solveThrowsOperation } from "../../api/solveCommand";

beforeEach(() => {
  jest.spyOn(global.Math, "random");
});

afterEach(() => {
  jest.spyOn(global.Math, "random").mockRestore();
});

describe("solveDiceThrow", () => {
  test("solves die throws without advantage or disadvantage", () => {
    // @ts-ignore
    global.Math.random.mockReturnValueOnce(0.4).mockReturnValueOnce(0.65);
    expect(
      solveDiceThrow({
        type: "DICE",
        faces: 20,
        count: 2,
        modifier: null,
      }),
    ).toEqual({
      modifier: null,
      type: "DICE",
      faces: 20,
      count: 2,
      values: [9, 14],
      trials: [[9, 14]],
      result: 9 + 14,
    });
  });

  test("provides the right value when random is 0", () => {
    // @ts-ignore
    global.Math.random.mockReturnValueOnce(0);
    expect(
      solveDiceThrow({
        type: "DICE",
        faces: 100,
        count: 1,
        modifier: null,
      }),
    ).toEqual({
      type: "DICE",
      faces: 100,
      count: 1,
      values: [1],
      trials: [[1]],
      result: 1,
      modifier: null,
    });
  });

  test("provides the right value when random is almost 1", () => {
    // @ts-ignore
    global.Math.random.mockReturnValueOnce(0.99999999);
    expect(
      solveDiceThrow({
        type: "DICE",
        faces: 4,
        count: 1,
        modifier: null,
      }),
    ).toEqual({
      type: "DICE",
      faces: 4,
      count: 1,
      values: [4],
      trials: [[4]],
      result: 4,
      modifier: null,
    });
  });

  test("solves die throws with advantage when first is smaller", () => {
    // @ts-ignore
    global.Math.random.mockReturnValueOnce(0.4).mockReturnValueOnce(0.65);
    expect(
      solveDiceThrow({
        type: "DICE",
        faces: 20,
        count: 1,
        modifier: "ADVANTAGE",
      }),
    ).toEqual({
      type: "DICE",
      faces: 20,
      count: 1,
      values: [14],
      trials: [[9], [14]],
      result: 14,
      modifier: "ADVANTAGE",
    });
  });

  test("solves die throws with advantage when first is greater", () => {
    // @ts-ignore
    global.Math.random.mockReturnValueOnce(0.65).mockReturnValue(0.4);
    expect(
      solveDiceThrow({
        type: "DICE",
        faces: 20,
        count: 1,
        modifier: "ADVANTAGE",
      }),
    ).toEqual({
      type: "DICE",
      faces: 20,
      count: 1,
      values: [14],
      trials: [[14], [9]],
      result: 14,
      modifier: "ADVANTAGE",
    });
  });

  test("solves die throws with disadvantage when first is smaller", () => {
    // @ts-ignore
    global.Math.random.mockReturnValueOnce(0.4).mockReturnValueOnce(0.65);
    expect(
      solveDiceThrow({
        type: "DICE",
        faces: 20,
        count: 1,
        modifier: "DISADVANTAGE",
      }),
    ).toEqual({
      type: "DICE",
      faces: 20,
      count: 1,
      values: [9],
      trials: [[9], [14]],
      result: 9,
      modifier: "DISADVANTAGE",
    });
  });

  test("solves die throws with disadvantage when first is greater", () => {
    // @ts-ignore
    global.Math.random.mockReturnValueOnce(0.65).mockReturnValueOnce(0.4);
    expect(
      solveDiceThrow({
        type: "DICE",
        faces: 20,
        count: 1,
        modifier: "DISADVANTAGE",
      }),
    ).toEqual({
      type: "DICE",
      faces: 20,
      count: 1,
      values: [9],
      trials: [[14], [9]],
      result: 9,
      modifier: "DISADVANTAGE",
    });
  });

  test("solves multi-dice throws with advantage", () => {
    global.Math.random
      // @ts-ignore
      .mockReturnValueOnce(0.65) // 13
      .mockReturnValueOnce(0.4) // 8
      .mockReturnValueOnce(0.25) // 5
      .mockReturnValueOnce(0.9); // 18;
    expect(
      solveDiceThrow({
        type: "DICE",
        faces: 20,
        count: 2,
        modifier: "ADVANTAGE",
      }),
    ).toEqual({
      type: "DICE",
      faces: 20,
      count: 2,
      values: [6, 19],
      trials: [
        [14, 9],
        [6, 19],
      ],
      result: 6 + 19,
      modifier: "ADVANTAGE",
    });
  });

  test("solves multi-dice throws with disadvantage", () => {
    global.Math.random
      // @ts-ignore
      .mockReturnValueOnce(0.65) // 13
      .mockReturnValueOnce(0.4) // 8
      .mockReturnValueOnce(0.25) // 5
      .mockReturnValueOnce(0.9); // 18;
    expect(
      solveDiceThrow({
        type: "DICE",
        faces: 20,
        count: 2,
        modifier: "DISADVANTAGE",
      }),
    ).toEqual({
      type: "DICE",
      faces: 20,
      count: 2,
      values: [14, 9],
      trials: [
        [14, 9],
        [6, 19],
      ],
      result: 14 + 9,
      modifier: "DISADVANTAGE",
    });
  });
});
