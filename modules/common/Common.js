
var common = {
    stringToHex: function (str, callback){
        var val="";
        var arr = str.split(",");
        for(var i = 0; i < arr.length; i++){
            val += arr[i].fromCharCode(i);
        }
        callback(null, val);
    }
};

module.exports = common;