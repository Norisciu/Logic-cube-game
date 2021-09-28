import {getTokens} from "../Tokenizer";


describe("tokenizer" , () => {
   
    it("breaks 1 recognizable token without spaces in a singleton array" , () => {
        const string = "yellow";
        const tokens  = getTokens(string);
          
        expect(tokens).toHaveLength(1);
        expect(tokens).toEqual(["yellow"]);
    });

    it("breaks statement containing only vald words into correct tokens" , () => {
        const statement = "red or yellow and blue or not yellow not";
        const expectdResult  = statement.split(/\s+/);
        const tokens =  getTokens(statement);
          
        expect(tokens).toBeDefined();
        expect(tokens).toEqual(expectdResult);
    });

    it("skips words which are not recognizable as tokens without breaking or throwing errors" , () => {
        const statement = "just right or not green";
        const tokens =  getTokens(statement);
          
        expect(tokens).toBeDefined();
        expect(tokens).toEqual(["right" , "or" , "not" , "green"]);
    });



})