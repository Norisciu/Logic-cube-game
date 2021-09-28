import { Evaluator } from "../Evaluator";
import { Parser } from "../../Parser/CubeParserUpdate";

describe("evaluator test", () => {
    let evaluator, parser;


    beforeEach(() => {
        evaluator = new Evaluator();
        parser = new Parser("");
    })


    const performTest = (statement, sideDirection, sideColor , isChecking) => {
        const testName =  `"${statement}" with (${sideDirection} , ${sideColor}) -> ${isChecking}`
        it(testName , () => {
            const parsedStatement = parser.parse(statement);
            const side = { direction : sideDirection , color : sideColor};
            let evalResult  = evaluator.evaluate(parsedStatement , side);
            expect(evalResult).toEqual(isChecking);
        })
    }
  

    // like evaluate(instruction , { direction : direction , color : color})
    it("evaluates single side", () => {
        let side = { direction: "right", color: "yellow" };
        let statement = "yellow";
        let parsedStatement = parser.parse(statement);
        expect(evaluator.evaluate(parsedStatement, side)).toEqual(true);
    });
    
    performTest("top" , "top" , "" , true);
    performTest("left" , "right" , "" , false);
    performTest("not top" , "right" , "" , true);
    performTest("not not top" , "top" , "" , true);
    performTest("not not top" , "bottom" , "" , false);
    performTest("not not not not bottom" , "bottom" , "" , true); 



})