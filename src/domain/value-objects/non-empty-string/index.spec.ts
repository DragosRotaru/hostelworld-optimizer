import { Is,} from ".";

describe("non-empty-string", () => {
  test("there is some text", () => {
    expect(Is("uhebvc")).toBeTruthy();
    expect(Is("a")).toBeTruthy();
    expect(Is("")).toBeFalsy();
    expect(Is(" ")).toBeTruthy();
    expect(Is(".")).toBeTruthy();
    expect(Is(",")).toBeTruthy();
  });

});
