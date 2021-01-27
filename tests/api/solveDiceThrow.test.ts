import solveDiceThrow from "../../api/solveDiceThrow";
import { roll } from "../../api/utils";

jest.mock("../../api/utils");

const mockedRoll = roll as jest.MockedFunction<typeof roll>;

beforeEach(() => {
  mockedRoll.mockReturnValue(null);
});

afterEach(() => {
  mockedRoll.mockReset();
});

describe("solveDiceThrow", () => {
  test("solves die throws without advantage or disadvantage", () => {
    mockedRoll
      .mockReturnValueOnce(9)
      .mockReturnValueOnce(2)
      .mockReturnValueOnce(4);
    expect(
      solveDiceThrow({
        type: "DICE",
        faces: 10,
        count: 3,
        modifier: null,
      }),
    ).toEqual({
      type: "DICE",
      faces: 10,
      count: 3,
      modifier: null,
      values: [9, 2, 4],
      trials: [[9, 2, 4]],
      result: 9 + 2 + 4,
    });
    expect(mockedRoll.mock.calls).toEqual([[10], [10], [10]]);
  });

  test("solves die throws with advantage when first is smaller", () => {
    mockedRoll.mockReturnValueOnce(9).mockReturnValueOnce(14);
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
      modifier: "ADVANTAGE",
      values: [14],
      trials: [[9], [14]],
      result: 14,
    });
    expect(mockedRoll.mock.calls).toEqual([[20], [20]]);
  });

  test("solves die throws with advantage when first is greater", () => {
    mockedRoll.mockReturnValueOnce(14).mockReturnValueOnce(9);
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
      modifier: "ADVANTAGE",
      values: [14],
      trials: [[14], [9]],
      result: 14,
    });
    expect(mockedRoll.mock.calls).toEqual([[20], [20]]);
  });

  test("solves die throws with disadvantage when first is smaller", () => {
    mockedRoll.mockReturnValueOnce(9).mockReturnValueOnce(14);
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
      modifier: "DISADVANTAGE",
      values: [9],
      trials: [[9], [14]],
      result: 9,
    });
    expect(mockedRoll.mock.calls).toEqual([[20], [20]]);
  });

  test("solves die throws with disadvantage when first is greater", () => {
    mockedRoll.mockReturnValueOnce(14).mockReturnValueOnce(9);
    expect(
      solveDiceThrow({
        type: "DICE",
        faces: 15,
        count: 1,
        modifier: "DISADVANTAGE",
      }),
    ).toEqual({
      type: "DICE",
      faces: 15,
      count: 1,
      modifier: "DISADVANTAGE",
      values: [9],
      trials: [[14], [9]],
      result: 9,
    });
    expect(mockedRoll.mock.calls).toEqual([[15], [15]]);
  });

  test("solves multi-dice throws with advantage", () => {
    mockedRoll
      .mockReturnValueOnce(14)
      .mockReturnValueOnce(9)
      .mockReturnValueOnce(6)
      .mockReturnValueOnce(19);
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
      modifier: "ADVANTAGE",
      values: [6, 19],
      trials: [
        [14, 9],
        [6, 19],
      ],
      result: 6 + 19,
    });
    expect(mockedRoll.mock.calls).toEqual([[20], [20], [20], [20]]);
  });

  test("solves multi-dice throws with disadvantage", () => {
    mockedRoll
      .mockReturnValueOnce(14)
      .mockReturnValueOnce(9)
      .mockReturnValueOnce(6)
      .mockReturnValueOnce(19);
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
      modifier: "DISADVANTAGE",
      values: [14, 9],
      trials: [
        [14, 9],
        [6, 19],
      ],
      result: 14 + 9,
    });
  });

  test("faces < 0", () => {
    mockedRoll
      .mockReturnValueOnce(14)
      .mockReturnValueOnce(9)
      .mockReturnValueOnce(6)
      .mockReturnValueOnce(19);
    expect(
      solveDiceThrow({
        type: "DICE",
        faces: -20,
        count: 2,
        modifier: "DISADVANTAGE",
      }),
    ).toEqual({
      type: "DICE",
      faces: -20,
      count: 2,
      modifier: "DISADVANTAGE",
      values: [-6, -19],
      trials: [
        [-14, -9],
        [-6, -19],
      ],
      result: -6 - 19,
    });
    expect(mockedRoll.mock.calls).toEqual([[20], [20], [20], [20]]);
  });

  test("count = 0", () => {
    expect(
      solveDiceThrow({
        type: "DICE",
        faces: 10,
        count: 0,
        modifier: null,
      }),
    ).toEqual({
      type: "DICE",
      faces: 10,
      count: 0,
      values: [],
      trials: [[]],
      result: 0,
      modifier: null,
    });
    expect(mockedRoll.mock.calls).toEqual([]);
  });
});
