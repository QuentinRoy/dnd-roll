Start
  = _ res:LabeledCommand _ { return res; }

LabeledCommand
  = label:Label _ cmd:Command { return { label, ...cmd }; }
  / cmd:Command { return { label: null, ...cmd }; }

Label
  = text:Text _ ":" {
      return { value: text.trim(), text: text(), location: location() };
    }

Command
  = operation:Operation _ optionSet:OptionSet {
      return { operation, optionSet };
    }
  / operation:Operation {
      return { operation };
    }

OptionSet
  = "(" _ values:OptionList _ ")" {
      return { values, location: location(), text: text() };
    }

OptionList
  = head:Option _ "," _ tail:OptionList { return [head, ...tail]; }
  / option:Option { return [option]; }

Option
  = "repeat" _ value:Integer {
      return { type: "REPEAT", value, location: location(), text: text() };
    }
  / "no" _ "crits" {
      return {
        type: "CRITS",
        enabled: false,
        location: location(),
        text: text()
      }
    }
  / "crits" {
      return {
        type: "CRITS",
        enabled: true,
        location: location(),
        text: text()
      }
    }

Operation
  = cond:ConditionalOperation { return { type: "CONDITIONAL", ...cond }; }
  / test:TestOperation { return { type: "TEST", ...test } }
  / ThrowOperation
   
ConditionalOperation
  = test:TestOperation _ "?" _ success:ThrowOperation { 
      return { ...test, success, location: location(), text: text() };
    }

TestOperation
  = test:ThrowOperation _ comparator:Comparator _ target:ThrowOperation {
      return { test, comparator, target, location: location(), text: text() } 
    }

ThrowOperation
  = throws:Throws {
      return { type: "THROWS", throws, location: location(), text: text() };
    }

Throws
  = head:Throw _ (&Sign) tail:Throws { return [head, ...tail] }
  / t:Throw { return [t]; }

Throw
  = sign:Sign _ count:Integer faces:Dice modifier:Modifier? {
      return {
        type: "DICE",
        faces: sign * faces,
        count: count,
        modifier,
        text: text(),
        location: location()
      };
    }
  / count:Integer faces:Dice modifier:Modifier? {
      return {
        type: "DICE",
        faces, count,
        modifier,
        location: location(),
        text: text()
      };
    }
  / sign:Sign _ number:Integer {
      return { 
        type: "NUMBER",
        value: sign * number,
        location: location(),
        text: text()
      };
    }
  / value:Integer {
      return { type: "NUMBER", value, location: location(), text: text() };
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
  = type:(">=" / "<=" / ">" / "<" / "=") {
      return { type, location: location(), text: text() };
    }

_ "whitespace"
  =$ [ \t\n\r]*
  
Text
  =$ [a-zA-Z\-_0-9 ]+