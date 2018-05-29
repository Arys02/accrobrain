


var logger = require('winston');

module.exports = {

    parse: function parse2(listToken, arrayToken) {
        return parse3(listToken, (new Array(30)).fill(0, 0, 30), arrayToken);
    },

}


function parse3(listToken, array, arrayToken) {
    logger.info("arrayToken = [" + arrayToken + "]");
    var cells = array; 
    var index = 0;
    var result = "";
    for (var i = 0; i < listToken.length; ++i) {
        var token = listToken[i];
        logger.info("token : '"+token+"'");
        switch (token) {
            case arrayToken[0]:
                parsePlus(cells, index);
                break;
            case arrayToken[1]:
                parseMinus(cells, index);
                break;
            case arrayToken[2]:
                index = parseNext(index);
                break;
            case arrayToken[3]:
                index = parsePrevious(index);
                break;
            case arrayToken[4]:
                result += parsePrint(cells, index);
                break;
            case arrayToken[5]:
                i = parseLoop(cells, index, listToken, i + 1, cells, arrayToken);
                break;
            default:
                throw "Syntax Error : Unknown Instruction";
        };

        logger.info("index = " + index);
        logger.info("cells["+index+"] = "+ cells[index]);
        logger.info("-----------");

    }


    return result;
}
function parseLoop(cells, index, tokenList, i, cells, arrayToken) {
    subTokenList = [];
    size = 0;
    while (i < 30000 && tokenList[i] != arrayToken[6]) {
        subTokenList.push(tokenList[i]);
        i++;
    }
    if (i == 30000)
        throw "Syntax Error : Loop Not Finished.";
    var nbLoop = cells[index];
    var originIndex = index;
    for (var j = 0; j < nbLoop; j++) {
        parse3(subTokenList, cells, arrayToken);
        //cells[originIndex]--;
    }
    return i;
}
function parsePlus(cells, index) {
    cells[index]++;
}
function parseMinus(cells, index) {
    if (cells[index] == 0)
        throw "Error : Value at [" + index + "] cannot be less than 0";
    cells[index]--;
}
function parsePrint(cells, index) {
    return String.fromCharCode(cells[index]);
}
function parseNext(index) {
    if (index > 30000)
        throw "Error : Next cell out of bound";
    return index + 1;
}
function parsePrevious(index) {
    if (index == 0)
        throw "Error : Previous cell out of bound";
    return index - 1;
}
