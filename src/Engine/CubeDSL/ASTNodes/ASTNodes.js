export class BinaryExpression{
    constructor(left  , op  , right){
        this.left = left;
        this.op = op;
        this.right =  right;
    }

    toString(){
        return `( ${this.op.toString()} ${this.left.toString()} ${this.right.toString()} )`;
    }
}

export class UnaryExpression{
    constructor(op  , right){
        this.right =  right;
        this.op = op;
    }

    toString(){
        return `( ${this.op.toString()} ${this.right.toString()} )`;
    }
}

export class ColorExpression{
    constructor(color){
        this.color  = color;
    }
    toString(){
        return this.color;
    }
}

export class DirectionExpression{
    constructor(direction){
        this.direction  = direction;
    }

    toString(){
        return this.direction
    }
}

export class NothingExpression{
    toString(){
        return "Nothing";
    }
}