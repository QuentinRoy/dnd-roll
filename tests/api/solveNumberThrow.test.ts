import solveNumberThrow from "../../api/solveNumberThrow";

describe("solveNumberThrow", () => {
  test("just adds the value as a result", () => {
    expect(
      solveNumberThrow({
        type: "NUMBER",
        value: -5,
      }),
    ).toEqual({
      type: "NUMBER",
      value: -5,
      result: -5,
    });
  });
});
