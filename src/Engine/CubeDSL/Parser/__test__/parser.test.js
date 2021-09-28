import { Parser } from "../CubeParserUpdate";
import { Parser as ParserReference} from "../CubeParser1";
import { BinaryExpression, ColorExpression, DirectionExpression, NothingExpression, UnaryExpression } from "../../ASTNodes/ASTNodes";
import { colorsEnum } from "../../Tokenizer/tokensTypes";

describe("parser " , () => {
    let parser , parserReference;

  

    beforeEach(() => {
        parser  = new Parser("");
        parserReference = new ParserReference("");
    })

    const parsesExpression  = (expression , parsdResultString) => {
        it(`parses "${expression}" to "${parsdResultString}"` , () => {
            const parsdResult  = parser.parse(expression);
            expect(parsdResult.toString()).toEqual(parsdResultString);
        })
    }

    describe("it parses all in game colors" , () => {
        it(`parses ${colorsEnum.YELLOW}` , () => {
            expect(parser.parse(colorsEnum.YELLOW)).toBeDefined();
        })

        it(`parses ${colorsEnum.BLUE}` , () => {
            expect(parser.parse(colorsEnum.BLUE)).toBeDefined();
        })
        
        it(`parses ${colorsEnum.GREEN}` , () => {
            expect(parser.parse(colorsEnum.GREEN)).toBeDefined();
        })
        
        it(`parses ${colorsEnum.RED}` , () => {
            expect(parser.parse(colorsEnum.RED)).toBeDefined();
        })
    });


    describe("it parses all in game directions" , () => {
        it("parses left direction" , () => {
            expect(parser.parse("left")).toBeDefined();
        })

        it("parses right direction" , () => {
            expect(parser.parse("left")).toBeDefined();
        })
        
        it("parses top direction" , () => {
            expect(parser.parse("left")).toBeDefined();
        })
        
        it("parses botttom direction" , () => {
            expect(parser.parse("left")).toBeDefined();
        })
    })


    it("parses binary expression" , () => {
        const statement =  "yellow or bottom";
        const parserResult =  parser.parse(statement);
        //   
        expect(parser.parse(statement)).toBeDefined();
        // expect(parser.parse(statement)).toEqual();
    });

    it("parses negtd unary expression" , () => {
        const statement  = "not yellow";
        const parserUpdateResult  = parser.parse(statement);
        const parserReferenceResult = parserReference.parse(statement);
          
          
        expect(parserUpdateResult).toEqual(parserReferenceResult);
    })

    it("parses complicated expression with the same result as the reference parser" , () => {
        const statement  = "not yellow or green and not blue or red";
        const parserUpdateResult  = parser.parse(statement);
        const parserReferenceResult = parserReference.parse(statement);
          
          
        expect(parserUpdateResult).toEqual(parserReferenceResult);
    })

    it("parses nothing" , () => {
        expect(parser.parse("nothing")).toBeInstanceOf(NothingExpression);
    })

    parsesExpression("nothing" , "Nothing");
    parsesExpression("red or yellow"  , "( or red yellow )");
    parsesExpression("red or not yellow" , "( or red ( not yellow ) )");
    parsesExpression("not not yellow" , "( not ( not yellow ) )");
    parsesExpression("yellow or bottom and not left" , "( and ( or yellow bottom ) ( not left ) )");
    parsesExpression(
        "yellow and right and not left or green" , 
        "( or ( and ( and yellow right ) ( not left ) ) green )"
    );

    it("parses unary expression with negation" , () => {
        expect(parser.parse("not yellow")).toBeInstanceOf(UnaryExpression);
    });

    it("parses simple binary expression" , () => {
        const expression  = "red or right";
        expect(parser.parse(expression)).toBeInstanceOf(BinaryExpression);
    });

    it("parses more complicatd binary expression" , () => {
        const expression  = "red or right and not yellow";
          

        expect(parser.parse(expression)).toBeInstanceOf(BinaryExpression);
    })

    it("ignores unrecognizable words without breaking" , () => {
        const expression = "not red or green and not yellow";
        const parserResult  = parser.parse(expression);

        expect(parser.parse(expression)).toBeInstanceOf(BinaryExpression);
    })
})

