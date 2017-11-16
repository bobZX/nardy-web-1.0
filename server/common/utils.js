var fs = require("fs");

//递归删除文件夹
var deleteFolderRecursive = function(path) {
    var files = [];
    if( fs.existsSync(path) ) {
        files = fs.readdirSync(path);
        files.forEach(function(file,index){
            var curPath = path + "/" + file;
            if(fs.statSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};

var Utils = {

	isMobileClient:function(req){
		var deviceAgent = req.headers['user-agent'].toLowerCase();
		var agentID = deviceAgent.match(/(iphone|ipod|ipad|android)/);
		console.log(deviceAgent);
		console.log(agentID);
		if(agentID){
			return true;
		}else{
			return false;
		}
	},
	//删除文件或文件夹
	deleteFiles:function(path){
		var stat = fs.lstatSync(path);
		console.log(path)
		if(stat.isDirectory()){
			deleteFolderRecursive(path);
		}else{
			fs.unlink(path);
		}
	}
}

module.exports = Utils;