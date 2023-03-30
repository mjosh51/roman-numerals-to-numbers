const box = document.getElementById('input-box');
const button = document.getElementById('action');
const answer = document.getElementById('answer');

box.addEventListener('input', getAnswer);
let default_response = 'no question';
function getAnswer(e) {
  e.preventDefault();
  const text = box.value;
  let result = romanToInt(text);
  if (result == 0) result = default_response;
  answer.innerHTML = 'Answer: ' + '<strong>' + result + '</strong>';
}

// Roman numeral to integer
var romanToInt = function (s) {
  s = s.toUpperCase();

  // define an array of objects
  // objects will contain roman value, figure, priority, etc.
  let arr = [
    {
      roman: 'I',
      figure: 1,
      precedence: 1,
      disallowed_preceeding_characters: [],
    },
    {
      roman: 'V',
      figure: 5,
      precedence: 2,
      disallowed_preceeding_characters: [],
    },
    {
      roman: 'X',
      figure: 10,
      precedence: 3,
      disallowed_preceeding_characters: ['V'],
    },
    {
      roman: 'L',
      figure: 50,
      precedence: 4,
      disallowed_preceeding_characters: ['I', 'V'],
    },
    {
      roman: 'C',
      figure: 100,
      precedence: 5,
      disallowed_preceeding_characters: ['I', 'V', 'L'],
    },
    {
      roman: 'D',
      figure: 500,
      precedence: 6,
      disallowed_preceeding_characters: ['I', 'V', 'X', 'L'],
    },
    {
      roman: 'M',
      figure: 1000,
      precedence: 7,
      disallowed_preceeding_characters: ['I', 'V', 'X', 'L', 'D'],
    },
  ];

  let regex = /[ABEFGHJKNOPQRSTUWYZ]+/; // characters not known as roman numerals or blacklisted characters
  let integer = 0; // initiate result integer
  let error; // initiate error variable
  let regexp1 = /(I{4,}|X{4,}|C{4,}|M{4,})/; // characters that can only be repeated up to three times consecutively
  let regexp2 = /(V{2,}|L{2,}|D{2,})/; // characters that can only be repeated up to two times consecutively
  if (!s.match(regex)) {
    // if character is not blacklisted
    if (s.match(regexp1)) {
      // if I or X or C or M is repeated more than three times consecutively
      error = 'Not a valid roman numeral';
      return error;
    } else if (s.match(regexp2)) {
      // if V or L or D is repeated more than two times consecutively
      error = 'Not a valid roman numeral';
      return error;
    }

    if (s.length == 1) {
      // if string is a character, return equivalent number value
      let obj = arr.find((o) => o.roman === s);
      integer += obj.figure;
    } else if (s.length > 1 && s.length <= 15) {
      // else if length of string is between 2 and 15
      let diff = 0; // initiate the difference variable

      // check if II or XX or CC or MM which are permitted in Roman numerals, starts string `s`.
      // Note that by this time, the characters are surely either of II or XX or CC or MM,
      // if true, check if the characters are not more than two
      // if more than two, check if the third character's precedence is greater than the preceeding
      // if that is true, it is not a valid roman numeral
      if (s.length == 3) {
        let rep = arr.find((o) => o.roman === s[1]);
        let nRep = arr.find((o) => o.roman === s[2]);
        if (s[0] == s[1]) {
          if (s[1] != s[s.length - 1] && rep.precedence < nRep.precedence) {
            error = 'Not a valid roman numeral';
            return error;
          }
        }
      }
      // check if III or XXX or CCC or MMM which are permitted in Roman numerals, starts string `s`
      // Note that by this time, the characters are surely either of II or XX or CC or MM,
      // if true, check if the characters are not more than three
      // if more than three, check if the fourth character's precedence is greater than the preceeding
      // if that is true, it is not a valid roman numeral
      if (s.length == 4) {
        let rep = arr.find((o) => o.roman === s[2]);
        let nRep = arr.find((o) => o.roman === s[3]);
        if (s[0] == s[1] && s[1] == s[2]) {
          if (s[2] != s[s.length - 1] && rep.precedence < nRep.precedence) {
            error = 'Not a valid roman numeral';
            return error;
          }
        }
      }

      for (let j = 0; j < s.length; j++) {
        // loop over supplied string
        let obj = arr.find((o) => o.roman === s[j]); // look for an object with the current character as its roman value
        let obj_1 = arr.find((o) => o.roman === s[0]); // get the object with the first character of the string as its roman value
        let obj_2 = arr.find((o) => o.roman === s[1]); // get the object with the second character of the string as its roman value

        if (obj) {
          // if object is found
          if (j == 0) {
            // check if loop just started
            // and if the first character is greater than the next
            // or if they are the same
            // if true, store the first character number value, since there is no need to deduct it from the second character. This value will be added to whatever the value of integer at the end of loop
            if (
              obj_1.precedence > obj_2.precedence ||
              obj_1.precedence === obj_2.precedence
            )
              integer = obj.figure;
          } else if (j > 0) {
            // otherwise if character is not the first character
            let obj_ = arr.find((o) => o.roman === s[j]); // get corresponding object of current character
            let obj__ = arr.find((o) => o.roman === s[j - 1]); // get the object of the preceeding character
            let ob_j = arr.find((o) => o.roman === s[j + 1]); // get the oject of the next character
            let check = obj_.precedence > obj__.precedence; // check if current character takes precedence over its preceeding character.

            if (check) {
              // if true, script assumes preceeding character should be subtracted from current character
              if (s[j + 1] && ob_j.roman == obj_.roman) {
                // check if there is a next character and that character is equal to the current character. So that strings like 'IXX', 'IVV', 'XLL', etc., are declared invalid
                error = 'Not a valid roman numeral';
                return error;
              } else if (j !== s.length - 1 && obj__.roman == ob_j.roman) {
                /*Declare string as an invalid roman numeral if a character preceeding value is same as the value of its next e.g. 'XLX', 'CMC', 'CDC', 'IXI', 'IVI', and their likes, are declared invalid  */
                // check if character is not the last and if preceeding character's roman value equals the next character's roman value.
                error = 'Not a valid roman numeral';
                return error;
              } else if (
                obj_.disallowed_preceeding_characters.includes(obj__.roman)
              ) {
                // also check if preceeding character is disallowed by current character's roman value
                error = 'Not a valid roman numeral';
                return error;
              } else {
                // otherwise subtract preceeding character from current character (figure values)
                diff = obj_.figure - obj__.figure; // their difference
                integer += diff; // add difference to whatever integer value is during loop
              }
            } else if (
              !check &&
              j !== s.length - 1 &&
              obj_.precedence < ob_j.precedence
            )
              // else if no substraction is required and character is not the last and its precedence is lesser than the precedence of the next character, pause computation (skip character) and continue loop.
              // for example, 'CIX', instead of the script to add 1 to 100, then add 10 = 111
              // it rather pauses the calculation by skipping that character to check if the next is of greater precedence,
              // if that is true, the skipped character is deducted from the next character
              // then the value of integer variable before and after the skip are added together
              continue;
            else {
              // otherwise add characters' roman figure values altogether
              integer += obj.figure;
            }
          }
        }
      }
    }
    return integer; // return integer
  } else {
    // if string contains invalid characters, return an error.
    error = 'Not a valid roman numeral';
    return error;
  }
};
