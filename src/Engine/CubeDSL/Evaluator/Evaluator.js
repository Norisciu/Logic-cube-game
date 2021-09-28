import { 
    BinaryExpression , 
    UnaryExpression , 
    ColorExpression , 
    DirectionExpression, 
    NothingExpression} from "../ASTNodes/ASTNodes";

export class Evaluator{
 
     
    evaluate(AST , object){
         
         
        if ( AST instanceof BinaryExpression) {
             
            let leftCheck  = this.evaluate(AST.left , object);
            let rightCheck = this.evaluate(AST.right , object);
            let result = this.binaryEvaluation(AST.op , leftCheck , rightCheck);
            
             
             
             
            return result;
        }

        else if (AST instanceof UnaryExpression){
             
            let rightCheck   = this.evaluate(AST.right , object);
            let result  = this.unaryEvaluation(AST.op , rightCheck);
            return result;
        }

        else if (AST instanceof ColorExpression){
            return this.objectPropertyEvaluation(AST , "color" , object)

             
        }

        else if (AST instanceof DirectionExpression){
            return this.objectPropertyEvaluation(AST , "direction" , object);
             
        }

        else if (AST instanceof NothingExpression){
            return false;
        }

        else {
              
            throw new Error("unknown AST instance");
        }
    }

    binaryEvaluation(operator , term , other){
        if (operator === AND_OPERATOR){
            return term && other;
        }

        else if (operator === OR_OPERATOR){
            return term || other;
        }

        else {
            throw new Error("unknown opertion");
        }
    }

    unaryEvaluation(operation , term){
        if (operation === NOT_OPERATOR){
            return ! term;
        }
    }

    objectPropertyEvaluation(AST , prop ,  object){
         
         
         
        if (!object[prop]) { return false; }
        return  AST[prop].toLowerCase() === object[prop].toLowerCase();
    }
}

const AND_OPERATOR =  "and";
const OR_OPERATOR =  "or";
const NOT_OPERATOR =  "not";
 