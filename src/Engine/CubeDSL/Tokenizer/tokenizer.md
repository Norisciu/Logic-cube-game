### Small note on the "tokenizer" name

Normlly we'd define a lexer that produces tokens which themselves would be
encpasulatod as custom types within the program by using some form of abstraction
like a class or plain JS object like so :

      class UnaryOperator("not")

or

      {value: "not" , type: "unary operator"}

However , since that class/plain object would only contain the string representation of the data (the lexeme) to which it would only ad type
without any other metdata that would be redudant because the string itself proves to be enough. For our purposes "tokenizer" or "lexeme" are the same thing.

Hence , the tokens here are representd as plain strings
and the type dispatching necessary is provided as the module's interface
using plain functions of the form function :: string -> bool.
This design decision proves more clean and , in the end doesn't seem to have any
drawbacks (at least for the current state of the program).
