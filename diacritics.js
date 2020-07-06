/**
 * OnlyCurrentDoc - add a @ as prefix
 * The above comment directs Apps Script to limit the scope of file
 * access for this add-on. It specifies that this add-on will only
 * attempt to read or modify the files in which the add-on is used,
 * and not all of the user's files. The authorization request message
 * presented to users will reflect this limited scope.
 * @author Sami Tarazi
 */
 
  
/**
 * >>>DEFAULT<<<
 * Creates a menu entry in the Google Docs UI when the document is opened.
 * This method is only used by the regular add-on, and is never called by
 * the mobile add-on version.
 *
 * @param {object} e The event parameter for a simple onOpen trigger. To
 *     determine which authorization mode (ScriptApp.AuthMode) the trigger is
 *     running in, inspect e.authMode.
 */
function onOpen(e) {
    DocumentApp.getUi().createAddonMenu()
        .addItem('Add Diacritics', 'showSidebar')
        .addToUi();
  }
  
  /**
   * >>>DEFAULT<<<
   * Runs when the add-on is installed.
   * This method is only used by the regular add-on, and is never called by
   * the mobile add-on version.
   *
   * @param {object} e The event parameter for a simple onInstall trigger. To
   *     determine which authorization mode (ScriptApp.AuthMode) the trigger is
   *     running in, inspect e.authMode. (In practice, onInstall triggers always
   *     run in AuthMode.FULL, but onOpen triggers may be AuthMode.LIMITED or
   *     AuthMode.NONE.)
   */
  function onInstall(e) {
    onOpen(e);
  }
  
  /**
   * >>>DEFAULT<<<
   * Opens a sidebar in the document containing the add-on's user interface.
   * This method is only used by the regular add-on, and is never called by
   * the mobile add-on version.
   */
  function showSidebar() {
    var ui = HtmlService.createHtmlOutputFromFile('sidebar')
        .setTitle('Arabic Diacritics');
    DocumentApp.getUi().showSidebar(ui);
  }
  
  
   /**
  * Global Variables:
  **/
  var diacriticsDictHTML = {
    dot_above: "&#775;",
    dot_below: "&#803;",
    macron_above: "&#772;", 
    macron_below: "&#817;" ,
    caron_above:"&#780;" ,
    breve_above: "&#774;"
    
  };
  
  var diacriticsDictUnicode = {
    dot_above: "\u0307",
    dot_below: "\u0323",
    macron_above: "\u0304", 
    macron_below: "\u0331",
    caron_above:"\u030C",
    breve_above: "\u0306"
  };
  
  var diacriticsDict = {
    dot_above: "0307",
    dot_below: "0323",
    macron_above: "0304", 
    macron_below: "0331",
    caron_above:"030C",
    breve_above: "0306"
  };
  
  var unicodePrefix = "&#x";
  var htmlUnicodeSuffix = ";";
  var unicodePrefix = "\\u";
  
  var lettersToDiacritics = {
   // "aa" : "a" + diacriticsDictUnicode.dot_above,
    "aa" : "ā",
    "Aa" : "Ā" ,
    "th" : "ṯ",
    "Th" : "Ṯ",
    "h_" : "ḥ",
    "H_" : "Ḥ",
    "kh" : "ḵ",
    "Kh" : "Ḵ",
    "d_" : "ḏ",
    "D_" : "Ḏ",
    "sh" : "š",
    "Sh" : "Š",
    "s_" : "ṣ",
    "S_" : "Ṣ",
    "dh": "ḍ",
    "Dh": "Ḍ",
    "t_" : "ṭ",
    "T_" : "Ṭ",
    "z_" : "ẓ",
    "Z_" : "Ẓ",
    "gh" : "ḡ",
    "Gh" : "Ḡ",
    "ou" : "ū",
    "Ou" : "Ū",
    "ee" : "ē",
    "Ee" : "Ē",
    "ii" : "ī",
    "Ii" : "Ī",
    "\'" : "ʾ", // 3ain
     "’" : "ʼ" // hamza
  };
  
  var LettersToExactDiacritics = {
    // var regexString = "ā|Ā|ṯ|Ṯ|ḥ|Ḥ|ḵ|Ḵ|ḏ|Ḏ|š|Š|ṣ|Ṣ|ḍ|Ḍ|ṭ|Ṭ|ẓ|Ẓ|ḡ|Ḡ|ū|Ū|ē|Ē|ī|Ī"; // this is exact
  
   // "aa" : "a" + diacriticsDictUnicode.dot_above,
    "aa" : "ā",
    "Aa" : "Ā",
  //  "th" : "ṯ",
   // "Th" : "Ṯ",
    "h_" : "ḥ",
    "H_" : "Ḥ",
    "kh" : "ḵ",
    "Kh" : "Ḵ",
    "d_" : "ḏ",
    "D_" : "Ḏ",
   // "sh" : "š",
   // "Sh" : "Š",
    "s_" : "ṣ",
    "S_" : "Ṣ",
    "dh": "ḍ",
    "Dh": "Ḍ",
    "t_" : "ṭ",
    "T_" : "Ṭ",
    "z_" : "ẓ",
    "Z_" : "Ẓ",
    "gh" : "ḡ",
    "Gh" : "Ḡ",
    "ou" : "ū",
    "Ou" : "Ū",
    "ee" : "ē",
    "Ee" : "Ē",
    "ii" : "ī",
    "Ii" : "Ī",
    "\'" : "ʾ", // 3ain
     "’" : "’" // hamza
  };
  
  /**
  * Checks and alters full document
  **/
  function alterFullDocument() {
     var doc = DocumentApp.getActiveDocument();
     var body = doc.getBody();
     // RangeElements object which finds next text matching regex
     var finderContent = body.findText("\\$[^[:space:]][^\\$]*[^[:space:]]\\$"); 
     
     // Loop through all rangeElements that have text matching the regex
     while (finderContent != null) {
     
       // Transliterate the matching text and insert it.
       transliterateAndInsert(finderContent);
       
       // Find next match
       finderContent = body.findText("\\$[^[:space:]][^\\$]*[^[:space:]]\\$", finderContent);
     }
  }
  
  /**
  * Checks and alters specified selection by the cursor
  **/
  function alterSelection () {
    var selection = DocumentApp.getActiveDocument().getSelection();
  
     if (selection) {
       var elements = selection.getRangeElements();
       
       // For each element, apply findText
       for (var i = 0; i < elements.length; i++) {
         if (elements[i].getElement().editAsText) { // check if element can be cast to text
           var selectedText = elements[i].getElement().asText();
           // The finderContent will always be within the range of the element, so it will not try to match words outside the scopre of element[i]
           var finderContent = selectedText.findText("\\$[^[:space:]][^\\$]*[^[:space:]]\\$"); // RangeElements object which finds next text matching regex
           while (finderContent != null) {
             // if element is partially selected, make sure to only transliterate expressions within the range of selection
             if (elements[i].isPartial()) {
               var selectionStartIndex = elements[i].getStartOffset();
               var selectionEndIndex   = elements[i].getEndOffsetInclusive() + 1;
                          
               // get starting and end index position of the match
               var finderStartPos = finderContent.getStartOffset();
               var finderEndPos = finderContent.getEndOffsetInclusive();
                 
               // Check if match is within selection range, then transliterate and insert text.
               if (finderStartPos >= selectionStartIndex && finderEndPos <= selectionEndIndex)
                 transliterateAndInsert(finderContent);   
             } else { // if element is fully selected, transliterate with no restrictions.
               // transliterate and insert text
               transliterateAndInsert(finderContent);
             }
             // Find next match
             finderContent = selectedText.findText("\\$[^[:space:]][^\\$]*[^[:space:]]\\$", finderContent);
          }
         }
       }
     }
  }
  
  function alterFootnotes() {
     var doc = DocumentApp.getActiveDocument();
     var footnotes = doc.getFootnotes();
      for (var i = 0; i < footnotes.length; i++) {
      
        // RangeElements object which finds next text matching regex
       var finderContent = footnotes[i].getFootnoteContents().findText("\\$[^[:space:]][^\\$]*[^[:space:]]\\$"); 
     
       // Loop through all rangeElements that have text matching the regex
       while (finderContent != null) {
         // Transliterate the matching text and insert it.
         transliterateAndInsert(finderContent);
         
         // Find next match
         finderContent = footnotes[i].getFootnoteContents().findText("\\$[^[:space:]][^\\$]*[^[:space:]]\\$", finderContent);
       }
      
      }
     
    Logger.log("Finding FootNotes");
  }
  
  function alterUntransliterate() {
     var doc = DocumentApp.getActiveDocument();
     var body = doc.getBody();
     // RangeElements object which finds next text matching regex
    // var regexString = "a" + diacriticsDictUnicode.macron_above + "|" + "t" + diacriticsDictUnicode.macron_below + "|"+"h" + diacriticsDictUnicode.dot_below + "|"
     //         + "k" + diacriticsDictUnicode.macron_below + "|"+ "d" + diacriticsDictUnicode.macron_below + "|"+ "s" + diacriticsDictUnicode.caron_above + "|"+ "s" + diacriticsDictUnicode.dot_below + "|"+ "d" + diacriticsDictUnicode.dot_below + "|"+ "t" + diacriticsDictUnicode.dot_below + "|"+ "z" + diacriticsDictUnicode.dot_below + "|"
        //      + "g" + diacriticsDictUnicode.macron_above + "|"+ "u" + diacriticsDictUnicode.macron_above + "|"+ "e" + diacriticsDictUnicode.macron_above + "|"+ "i" + diacriticsDictUnicode.macron_above;
     
     var regexString = "ā|Ā|ṯ|Ṯ|ḥ|Ḥ|ḵ|Ḵ|ḏ|Ḏ|š|Š|ṣ|Ṣ|ḍ|Ḍ|ṭ|Ṭ|ẓ|Ẓ|ḡ|Ḡ|ū|Ū|ē|Ē|ī|Ī"; // this is exact
     var finderContent = body.findText(regexString); 
     
     // Loop through all rangeElements that have text matching the regex
     while (finderContent != null) {
     
       // Transliterate the matching text and insert it.
       reverseTransliterationAndInsert(finderContent);
       
       // Find next match
       finderContent = body.findText(regexString, finderContent);
     }
     
     alterUntransliterateFootnotes();
  }
  
  function alterUntransliterateFootnotes() {
     var doc = DocumentApp.getActiveDocument();
     var footnotes = doc.getFootnotes();
     var regexString = "ā|Ā|ṯ|Ṯ|ḥ|Ḥ|ḵ|Ḵ|ḏ|Ḏ|š|Š|ṣ|Ṣ|ḍ|Ḍ|ṭ|Ṭ|ẓ|Ẓ|ḡ|Ḡ|ū|Ū|ē|Ē|ī|Ī"; // this is exact
  
     
      for (var i = 0; i < footnotes.length; i++) {
      
        // RangeElements object which finds next text matching regex
       var finderContent = footnotes[i].getFootnoteContents().findText(regexString); 
     
       // Loop through all rangeElements that have text matching the regex
       while (finderContent != null) {
         // Transliterate the matching text and insert it.
         reverseTransliterationAndInsert(finderContent);
         
         // Find next match
         finderContent = footnotes[i].getFootnoteContents().findText(regexString, finderContent);
       }
      
      }
     
    Logger.log("Finding FootNotes");
  
  
  
  }

  function alterWithoutDollar() {
    Logger.log("hey");


  }
  
  /**
  * Extracts the expression between $ ... $, transliterates it, and replaces it by the original expression with a highlight color.
  **/
  function transliterateAndInsert(finderContent) {
    // get element which contains the match
       var outputContent = finderContent.getElement().asText();
       
       // get starting and end index position of the match
       var startPos = finderContent.getStartOffset();
       var endPos = finderContent.getEndOffsetInclusive();
       
       // get the exact text of the match
       var currentText = outputContent.getText().substring(startPos + 1, endPos);
       // get current styling of expression
       var styling = finderContent.getElement().getAttributes(startPos + 1);
       
       // transliterate the match and store in a new variable
       var transliteratedText = transliterate(currentText);
       
       // replace by transliteration, add styling, and highlight.
       outputContent.deleteText(startPos, endPos);
       outputContent.insertText(startPos, transliteratedText);
       outputContent.setAttributes(startPos, startPos + transliteratedText.length - 1 , styling);
       outputContent.setBackgroundColor(startPos, startPos + transliteratedText.length - 1 , '#ea7ead');
  
  }
  
  function reverseTransliterationAndInsert(finderContent) {
  
    // get element which contains the match
       var outputContent = finderContent.getElement().asText();
       
       // get starting and end index position of the match
       var startPos = finderContent.getStartOffset();
       var endPos = finderContent.getEndOffsetInclusive();
       
       // get the exact text of the match
       var currentText = outputContent.getText().substring(startPos, endPos + 1);
       // get current styling of expression
       var styling = finderContent.getElement().getAttributes(startPos);
       
       // transliterate the match and store in a new variable
       var transliteratedText = reverseTransliterate(currentText);
       
       // replace by transliteration, add styling, and highlight.
       outputContent.deleteText(startPos, endPos);
       outputContent.insertText(startPos, transliteratedText);
       outputContent.setAttributes(startPos, startPos + transliteratedText.length - 1 , styling);
       outputContent.setBackgroundColor(startPos, startPos + transliteratedText.length - 1 , '#eaf4ff');
  
  }
  
  /**
  * Transliterate a given string based on dictionary key-value object.
  **/
  function transliterate (text) {
    var changedMatch = text;
    for (var key in LettersToExactDiacritics)
        changedMatch = changedMatch.replace(new RegExp(key, "g"), LettersToExactDiacritics[key]); // create a transliterated copy the match
        
    return changedMatch;
  }
  
  /**
  * reverse transliteration a given string based on dictionary key-value object.
  **/
  function reverseTransliterate (text) {
    var diacriticsToLetters = swap(LettersToExactDiacritics);
    var changedMatch = text;
    var tryingg = diacriticsToLetters["a\u0304"];
    for (var key in diacriticsToLetters)
        changedMatch = changedMatch.replace(new RegExp(key, "g"), diacriticsToLetters[key]); // create a transliterated copy the match
        
    return changedMatch;
  }
  
  
  function swap(json){
    var ret = {};
    for(var key in json){
      ret[json[key]] = key;
    }
    return ret;
  }
  
  function isWordExist(text) {
    return englishDictionary[text];
  
  }
  
   /**
    *Method for testing
    * \[\]\^_\{\|\}
   **/
   function getSelectedTextTest() {
    var doc = DocumentApp.getActiveDocument().getBody();
    
    for (var i = 0; i < doc.getNumChildren(); i++) {
    try{
        var childdd = doc.getChild(i).asParagraph().editAsText().findText("\\$[^[:space:]][^\\$]*[^[:space:]]\\$");
  
    } catch (err) {
    Logger.log(err);
    
    
    }
      var hey = "hey";
    
    
    }
  }
  
  /**
   * Gets the text the user has selected. If there is no selection,
   * this function displays an error message.
   *
   * @return {Array.<string>} The selected text.
   */
  function getSelectedText() {
    var selection = DocumentApp.getActiveDocument().getSelection();
    var text = [];
    var firstIndex = 0;
    var lastIndex = 0;
    
    if (selection) {
      var elements = selection.getSelectedElements();
      firstIndex = elements[0].getStartOffset();
      lastIndex = elements[elements.length - 1].getEndOffsetInclusive();
      for (var i = 0; i < elements.length; ++i) {
        if (elements[i].isPartial()) {
          var element = elements[i].getElement().asText();
          var startIndex = elements[i].getStartOffset();
          
          /**
          if (i == 0)
            firstIndex = elements[i].getStartOffset();
            
          if (i == elements.length - 1)
            lastIndex = elements[i].getEndOffsetInclusive();
  **/
          var endIndex = elements[i].getEndOffsetInclusive();
  
          text.push(element.getText().substring(startIndex, endIndex + 1));
        } else {
          var element = elements[i].getElement();
          /**
          if (i == 0)
            firstIndex = elements[i].getStartOffset();
                
          if (i == elements.length - 1)
            lastIndex = elements[i].getEndOffsetInclusive();
            **/
          // Only transliterate elements that can be edited as text; skip images and
          // other non-text elements.
          if (element.editAsText) {
            var elementText = element.asText().getText();
            // This check is necessary to exclude images, which return a blank
            // text element.
            if (elementText) {
              text.push(elementText);
            }
          }
        }
            
      }
    }
    if (!text.length) throw new Error('Please select some text.');
    return {
      selection: text,
      startingIndex: firstIndex,
      endingIndex: lastIndex
    };
    
  }
  
  
  
  /**
   * Gets the user-selected text and adds diacritics on it from the o
   * @param {string} origin The two-letter......
   * @param {string} dest blabla../
   * @return {Object} Object containing the original text and the result of the
   *     transliteration.
   */
  function getTextAndTransliteration() {
    var text = getSelectedText().join('\n'); 
    
   // Naive Implementation
    var matches = text.match(/`(.*?)`/g); // find all tokens between `...`
    
    if (matches) {
      matches.forEach(function(match) { // for each match:
      let changedMatch = match;
      for (var key in lettersToDiacritics)
        changedMatch = changedMatch.replace(new RegExp(key, "g"), lettersToDiacritics[key]); // create a transliterated copy the match
        
        text = text.replace(match, changedMatch.substring(1, changedMatch.length - 1)); // replace the match with the transliterated copy
      });
    }
  
   // End Naive Implementation
  
  
   
   
    
    return {
      text: text,
      transliteration: text
    };
  }
  
  
  
  
  
  
  /**
   * Replaces the text of the current selection with the provided text, or
   * inserts text at the current cursor location. (There will always be either
   * a selection or a cursor.) If multiple elements are selected, only inserts the
   * translated text in the first element that can contain text and removes the
   * other elements.
   *
   * @param {string} newText The text with which to replace the current selection.
   */
  function insertText(newText) {
    var selection = DocumentApp.getActiveDocument().getSelection();
    if (selection) {
      var replaced = false;
      var elements = selection.getSelectedElements();
      if (elements.length === 1 && elements[0].getElement().getType() ===
          DocumentApp.ElementType.INLINE_IMAGE) {
        throw new Error('Can\'t insert text into an image.');
      }
      for (var i = 0; i < elements.length; ++i) {
        if (elements[i].isPartial()) {
          var element = elements[i].getElement().asText();
          var startIndex = elements[i].getStartOffset();
          var endIndex = elements[i].getEndOffsetInclusive();
          element.deleteText(startIndex, endIndex);
          if (!replaced) {
            element.insertText(startIndex, newText);
            replaced = true;
          } else {
            // This block handles a selection that ends with a partial element. We
            // want to copy this partial text to the previous element so we don't
            // have a line-break before the last partial.
            var parent = element.getParent();
            var remainingText = element.getText().substring(endIndex + 1);
            parent.getPreviousSibling().asText().appendText(remainingText);
            // We cannot remove the last paragraph of a doc. If this is the case,
            // just remove the text within the last paragraph instead.
            if (parent.getNextSibling()) {
              parent.removeFromParent();
            } else {
              element.removeFromParent();
            }
          }
        } else {
          var element = elements[i].getElement();
          if (!replaced && element.editAsText) {
            // Only translate elements that can be edited as text, removing other
            // elements.
            element.clear();
            element.asText().setText(newText);
            replaced = true;
          } else {
            // We cannot remove the last paragraph of a doc. If this is the case,
            // just clear the element.
            if (element.getNextSibling()) {
              element.removeFromParent();
            } else {
              element.clear();
            }
          }
        }
      }
    } else {
      var cursor = DocumentApp.getActiveDocument().getCursor();
      var surroundingText = cursor.getSurroundingText().getText();
      var surroundingTextOffset = cursor.getSurroundingTextOffset();
  
      // If the cursor follows or preceds a non-space character, insert a space
      // between the character and the translation. Otherwise, just insert the
      // translation.
      if (surroundingTextOffset > 0) {
        if (surroundingText.charAt(surroundingTextOffset - 1) != ' ') {
          newText = ' ' + newText;
        }
      }
      if (surroundingTextOffset < surroundingText.length) {
        if (surroundingText.charAt(surroundingTextOffset) != ' ') {
          newText += ' ';
        }
      }
      cursor.insertText(newText);
    }
  }