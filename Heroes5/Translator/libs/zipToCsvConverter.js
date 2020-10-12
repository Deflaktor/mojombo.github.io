
Data = function () {
	this.error = false;
	this.entries = {};
}

var dataOriginal = new Data();
var dataDiff = new Data();
var dataCompare = new Data();
var dataUser = new Data();
var tableData = {
	rows : {},
};
var encoder = new TextEncoder("utf-16le");
var decoder = new TextDecoder("utf-16le");
var asyncRequestsGoingOn = 0;
var loadFromCSVFilePath;

function importOriginal(evt) {
	importFile(evt, dataOriginal);
}

function importDiff(evt) {
	importFile(evt, dataDiff);
}

function importCompare(evt) {
	importFile(evt, dataCompare);
}

function importUser(evt) {
	importFile(evt, dataUser);
}

Utils = {
    endsWith : function(str, suffix) {
    	return str.indexOf(suffix, str.length - suffix.length) !== -1;
	}
};

function importFile(evt, data) {
    data.error = false;
    data.entries = {};
    function handleFile(f) {
    	JSZip.loadAsync(f).then(function(zip) {
    		zip.forEach(function (relativePath, zipEntry) {
    			if(Utils.endsWith(zipEntry.name, ".txt")) {
    				data.entries[zipEntry.name] = zipEntry;
    			}
    		});
    	}, function (e) {
    		data.error = true;
    	});
    }
    var files = evt.target.files;
    var sortedFiles = [].slice.call(files);
    sortedFiles.sort();
    for (var i = 0, f; f = files[i]; i++) {
    	handleFile(f);
    }
}

function loadAllFiles() {
	if(asyncRequestsGoingOn != 0)
		return;
	tableData.rows = {};
	var entries = new Array();
	var data = dataDiff;
	if(Object.keys(data.entries)==0)
		data = dataOriginal;
	
	for (var entryName in data.entries) {
		entries.push(entryName);
	}

	asyncRequestsGoingOn = 0;
	loadEntries(entries, 0);

}

function loadEntries(entries, index) {
	var entryName = entries[index];
	if(!entryName)
		return;

	function originalAsync(data) {
    	function compareAndOrUserAsync(data2) {
    		function compareAndUserAsync(data3) {
    			function userAsyncAfterCompareAsync(data3) {
    				var user = dataUser.entries[entryName];
    				user.async("uint8array").then(function (data4) {
    					asyncRequestsGoingOn--;
						createRow(index, data, data2, data3, data4, entryName)
						$("#progress").text("To process: "+asyncRequestsGoingOn);
					});
    			}
    			var compare = dataCompare.entries[entryName];
    			compare.async("uint8array").then(userAsyncAfterCompareAsync);
    		}
    		function compareAsync(data3) {
    			asyncRequestsGoingOn--;
    			createRow(index, data, data2, data3, [], entryName);
    			$("#progress").text("To process: "+asyncRequestsGoingOn);
    		}
    		function userAsync(data4) {
    			asyncRequestsGoingOn--;
    			createRow(index, data, data2, [], data4, entryName);
    			$("#progress").text("To process: "+asyncRequestsGoingOn);
    		}
			if(data2.length == 0 || data.length > 0 && data2.length > 0 && decoder.decode(data) != decoder.decode(data2)) {
				var compare = dataCompare.entries[entryName];
				var user = dataUser.entries[entryName];
				if(compare && user){
					compare.async("uint8array").then(compareAndUserAsync);
				} else if(compare) {
					compare.async("uint8array").then(compareAsync);
				} else if(user) {
					user.async("uint8array").then(userAsync);
				} else {
					asyncRequestsGoingOn--;
					$("#progress").text("To process: "+asyncRequestsGoingOn);
					createRow(index, data, data2, [], [], entryName);
				}
			} else {
				asyncRequestsGoingOn--;
				$("#progress").text("To process: "+asyncRequestsGoingOn);
			}
    	}
    	var original = dataOriginal.entries[entryName];
    	if(original) {
    		original.async("uint8array").then(compareAndOrUserAsync);
    	} else {
    		compareAndOrUserAsync([]);
    	}
    }
    var diff = dataDiff.entries[entryName];
    if(diff) {
    	asyncRequestsGoingOn++;
    	diff.async("uint8array").then(originalAsync);
	}

	loadEntries(entries, index + 1);
}

function parseColumns() {
	var table = $("#csvTable");
	var csv = table.text();
	var firstLine = csv.split('\n', 2).join('\n');
	var rows = $.csv.toObjects(firstLine);
	$('#exportColumn').empty();
	var i = 0;
	for(var column in rows[0]) {
		if(i > 0)
			$('#exportColumn').append('<option>'+column+'</option>')
		i++;
	}
	$('#exportColumn option:last').prop('selected',true);
}

function save() {
	var table = $("#csvTable");
	var csv = table.text();
	/*if(csv.startsWith("file")) {
		csv = csv.substring(csv.indexOf("\n") + 1);
	}*/
	var rows = $.csv.toObjects(csv);
	var column = $('#exportColumn :selected').text();

	var zip = new JSZip();
	for(var i=0;i<rows.length;i++) {
		var row = rows[i];
		zip.file(row.file, encoder.encode(row[column]), {binary: true});
	}
	zip.generateAsync({type:"blob"})
	.then(function(content) {
    	saveAs(content, "output.zip");
	});
}

function saveAsCSV() {
	var table = $("#csvTable");
	var csv = table.text();
	var blob = new Blob([csv], {type: "text/plain;charset=utf-8"});
	saveAs(blob, "output.csv");
}

function loadFromCSVFile(evt) {
	var files = evt.target.files;
	var file = files[0];
	loadFromCSVFilePath = file;
}

function loadFromCSV() {
	var file = loadFromCSVFilePath;
	var reader = new FileReader();
	var table = $("#csvTable");

    reader.onload = function(evt) {
        table.text(evt.target.result);
    };

    reader.readAsText(file);
}

function reconstructTable() {
	var table = $("#csvTable");
	var rows = tableData.rows;
	var input = [];
	for(var row in rows) {
		input.push(rows[row]);
		table.append(rows[row]);
	}
	table.text($.csv.fromObjects(input));
	parseColumns();
}

function createRow(index, data, data2, data3, data4, file) {
	if(data.length > 0)
		var diff = decoder.decode(data);
	if(!diff)
		diff = "";
	if(data2.length > 0)
		var original = decoder.decode(data2);
	if(!original)
		original = "";
	if(data3.length > 0)
		var compare = decoder.decode(data3);
	if(!compare)
		compare = ""
	if(data4.length > 0)
		var user = decoder.decode(data4);
	if(!user)
		user = "";
	
	var row = {
		file : file,
		diff_of_source : original,
		source_language : diff,
		compare_language : compare,
		target_language : user,
	}

	tableData.rows[index] = row;

	if(asyncRequestsGoingOn == 0)
    	reconstructTable();
}

function onLoadDocument() {
	var $result = $("#result");
	$("#original").on("change", importOriginal);
	$("#diff").on("change", importDiff);
	$("#compare").on("change", importCompare);
	$("#user").on("change", importUser);
	$("#save").click(save);
	$("#saveAsCSV").click(saveAsCSV);
	$("#load").click(loadAllFiles);
	$("#loadFromCSV").click(loadFromCSV);
	$("#loadFromCSVFile").on("change", loadFromCSVFile);
	$("#csvTable").on("change keyup paste", parseColumns);

}
