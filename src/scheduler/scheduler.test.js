const {
  cartesianProduct,
  convertTo24Hour,
  compareFunction,
  hasConflict,
  merge,
  generateSubSchedules,
  generateSchedules,
} = require("./scheduler");

describe("cartesianProduct has correct functionality", () => {
  test("cartesianProduct works for an empty array", () => {
    expect(cartesianProduct([])).toEqual([]);
  });

  test("cartesianProduct for single array returns single array with same element", () => {
    expect(cartesianProduct([1])).toEqual([1]);
  });

  test("cartesianProduct works correctly", () => {
    const result = cartesianProduct([1, 2], [3, 4]);
    expect(result).toHaveLength(4);
    expect(result).toEqual([
      [1, 3],
      [1, 4],
      [2, 3],
      [2, 4],
    ]);
  });

  test("cartesianProduct returns flattened result when one argument is a 2D array", () => {
    const sections = ["s1", "s2"];
    const labs = [
      ["l1", "l2"],
      ["t1", "t2"],
    ];
    const result = cartesianProduct(sections, labs);
    expect(result).toHaveLength(4);
    expect(result.every((row) => row.length === 3)).toBe(true);
  });

  test("cartesianProduct works for nested arrays", () => {
    const sections = [["s1", "s2"]];
    const labs = [["l1", "l2"]];
    const result = cartesianProduct(sections, labs);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(["s1", "s2", "l1", "l2"]);
  });
});


describe("convertTo24Hour has correct functionality", () => {
  
})