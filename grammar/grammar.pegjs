Start
  = _ res:LabeledOperation _ { return res; }

LabeledOperation
  = op:Operation { return { label: null, ...op }; }
  / label:Label _ ":" _ op:Operation { return { label, ...op }; }

Operation
  = operation:Expression _ "(" _ instr:Instruction _ ")" {
    return { ...instr, operation };
  }
  / operation:Expression { return { type: "RUN", operation }; }
  
Instruction
  = "sum" _ value:Integer { return { type: "SUM", value }; }

Expression
  = cond:ConditionalThrows { return { type: "CONDITIONAL", ...cond }; }
  / test:Test { return { type: "TEST", ...test } }
  / ThrowOperation
   
ConditionalThrows
  = test:Test _ "?" _ success:ThrowOperation { return { ...test, success }; }
  
Test
  = test:ThrowOperation _ comparator:Comparator _ target:ThrowOperation {
  	return { test, comparator, target } 
  }

ThrowOperation
  = throws:Throws {
    return { type: "THROWS", throws };
  }

Throws
  = head:Throw _ (&Sign) tail:Throws { return [head, ...tail] }
  / t:Throw { return [t]; }

Throw
  = sign:Sign _ count:Integer faces:Dice modifier:Modifier? {
    return { type: "DICE", sign * faces, count:  count, modifier };
  }
  / count:Integer faces:Dice modifier:Modifier? {
    return { type: "DICE", faces, count, modifier };
  }
  / sign:Sign _ number:Integer {
    return { type: "NUMBER", value: sign * number};
  }
  / value:Integer {
    return { type: "NUMBER", value };
  }

Dice
 = "d" val:Integer { return val; }
 
Sign
  = "+" { return 1; }
  / "-" { return -1; } 

Modifier
  = "A" { return "ADVANTAGE"; }
  / "D" { return "DISADVANTAGE"; }

Integer
  = _ [0-9]+ { return parseInt(text(), 10); }
  
Comparator
  = (">=" / "<=" / ">" / "<" / "=")

_ "whitespace"
  =$ [ \t\n\r]*
  
Label
  =$ [a-z|A-Z]+