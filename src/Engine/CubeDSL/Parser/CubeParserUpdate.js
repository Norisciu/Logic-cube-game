  
  
  

import {
    BinaryExpression,
    UnaryExpression,
    ColorExpression,
    DirectionExpression,
    NothingExpression
} from "../ASTNodes/ASTNodes";

import {
    getTokens,
    isBinaryOperator,
    isDirection,
    isUnaryOperator,
    isColor,
    isNothing
} from "../Tokenizer/Tokenizer";


  


export class Parser {
    constructor(string) {
          
        this.tokens = getTokens(string);
        this.currentTokenIdx = 0;

        this.expression = this.binaryExpression();

    }

    parse(expression) {
          
        this.tokens = getTokens(expression);
        this.currentTokenIdx = 0;
        return this.rootExpression(expression);
    }

    rootExpression(expression) {
        return this.binaryExpression(expression);
    }

    binaryExpression() {
        let expr = this.unaryExpression();
          
        while (this.isAtBinaryOperator()) {
            let operator = this.previous();
            let right = this.unaryExpression();
            expr = new BinaryExpression(expr, operator, right)
        }

        return expr;
    }

    unaryExpression() {
        if (this.isAtUnaryOperator()) {
            let operator = this.previous();
            let right = this.unaryExpression();
            return new UnaryExpression(operator, right);
        }

        return this.primary();
    }

    primary() {
          
        if (this.isAtColor()) {
            let token = this.previous();
              
            return new ColorExpression(token);
        }

        else if (this.isAtDirection()) {
            let token = this.previous();
              
            return new DirectionExpression(token);
        }

        else if (this.isAtNothing()) {
              
            return new NothingExpression();
        }
    }



    isAtBinaryOperator() {
        const match = isBinaryOperator(this.peek());
        if (match) { this.advance() }
        return match;
    }

    isAtUnaryOperator() {
        const match = isUnaryOperator(this.peek());
        if (match) { this.advance() }
        return match;
    }

    isAtDirection() {
        const match = isDirection(this.peek());
        if (match) { this.advance() }
        return match;
    }

    isAtColor() {
        const match = isColor(this.peek());
        if (match) { this.advance() }
        return match;
    }

    isAtNothing() {
        const match = isNothing(this.peek());
        if (match) { this.advance() }
        return match;
    }

      
      

    matchAndAdvance(checkerFn) {
        if (checkerFn(this.peek())) {
            this.advance();
            return true;
        }
        return false;
    }


    check(token) {
        if (this.isAtEnd()) { return false; }
        return this.peek() === token;
    }

    advance() {
        if (!this.isAtEnd()) { this.currentTokenIdx++; }
        return this.previous();
    }

    peek() {
        return this.tokens[this.currentTokenIdx];
    }

    isAtEnd() {
        return this.currentTokenIdx > this.tokens.length - 1;
    }

    previous() {
        return this.tokens[this.currentTokenIdx - 1];
    }

}

