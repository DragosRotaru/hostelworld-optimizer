
import { Is, } from ".";

describe("email_id", ()  => { 
    test("email_is_valid", () => {
        expect(Is("xyzbdhgs@zpvozwsri4aryzatr.tk")).toBeTruthy();
        expect(Is("heb4337.kjksy@zebra.email")).toBeTruthy();
        expect(Is("jh.hbs__@zurtel.ml")).toBeTruthy();
        expect(Is("@wesyuliyansih469.tk")).toBeFalsy();
        expect(Is("xyzbdhgszpvozwsri4aryzatr.tk")).toBeFalsy();
        expect(Is("xyzbdhgs@zpvozwsri4aryzatrtk")).toBeFalsy();
    });
});