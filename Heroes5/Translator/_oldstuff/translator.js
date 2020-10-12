
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
	var begin = $("#beginOfTable");
	begin.nextAll("tr").remove();

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
	var lastEntry = true;
	if(!entries[index+1])
		lastEntry = true;

	function originalAsync(data) {
    	function compareAndOrUserAsync(data2) {
    		function compareAndUserAsync(data3) {
    			function userAsyncAfterCompareAsync(data3) {
    				var user = dataUser.entries[entryName];
    				asyncRequestsGoingOn++;
    				user.async("uint8array").then(function (data4) {
						tableData.rows[index] = createRow(data, data2, data3, data4, entryName)
						asyncRequestsGoingOn--;
    					if(asyncRequestsGoingOn == 0 && lastEntry)
    						reconstructTable();
					});
					asyncRequestsGoingOn--;
    			}
    			var compare = dataCompare.entries[entryName];
    			asyncRequestsGoingOn++;
    			compare.async("uint8array").then(userAsyncAfterCompareAsync);
    			asyncRequestsGoingOn--;
    		}
    		function compareAsync(data3) {
    			tableData.rows[index] = createRow(data, data2, data3, [], entryName);
    			asyncRequestsGoingOn--;
    			if(asyncRequestsGoingOn == 0 && lastEntry)
    				reconstructTable();
    		}
    		function userAsync(data4) {
    			tableData.rows[index] = createRow(data, data2, [], data4, entryName);
    			asyncRequestsGoingOn--;
    			if(asyncRequestsGoingOn == 0 && lastEntry)
    				reconstructTable();
    		}
			if(data2.length == 0 || data.length > 0 && data2.length > 0 && decoder.decode(data) != decoder.decode(data2)) {
				var compare = dataCompare.entries[entryName];
				var user = dataUser.entries[entryName];
				if(compare && user){
					asyncRequestsGoingOn++;
					compare.async("uint8array").then(compareAndUserAsync);
				} else if(compare) {
					asyncRequestsGoingOn++;
					compare.async("uint8array").then(compareAsync);
				} else if(user) {
					asyncRequestsGoingOn++;
					user.async("uint8array").then(userAsync);
				} else {
					tableData.rows[index] = createRow(data, data2, [], [], entryName);
				}
			}
			asyncRequestsGoingOn--;
			$("#progress").text("To process: "+asyncRequestsGoingOn);
			if(asyncRequestsGoingOn == 0 && lastEntry)
    			reconstructTable();
    	}
    	var original = dataOriginal.entries[entryName];
    	if(original) {
    		asyncRequestsGoingOn++;
    		original.async("uint8array").then(compareAndOrUserAsync);
    	} else {
    		asyncRequestsGoingOn++;
    		compareAndOrUserAsync([]);
    	}
    }
    var diff = dataDiff.entries[entryName];
    if(diff) {
    	diff.async("uint8array").then(originalAsync);
	}

	loadEntries(entries, index + 1);
}

function reconstructTable() {
	var table = $("#beginOfTable").parent();
	var rows = tableData.rows;
	for(var row in rows) {
		table.append(rows[row]);
		// var textAreas = rows[row].find("textarea");
		// resizeTextAreas(textAreas);
	}
	$('textarea').autosize();
}

function createRow(data, data2, data3, data4, file) {
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
	
	var row = $("<tr>");
	row.append($('<td>').text(file.substring(file.length-file.length, file.length)));
	row.append($('<td>')
	    .append($('<textarea>')
	        .attr('id', file)
	        .attr('class', 'original')
	        .text(original).on("change keyup paste", auto_grow)
	    )
	);
	row.append($('<td>')
	    .append($('<textarea>')
	        .attr('id', file)
	        .attr('class', 'diff')
	        .text(diff).on("change keyup paste", auto_grow)
	    )
	);
	row.append($('<td>')
	    .append($('<textarea>')
	        .attr('id', file)
	        .attr('class', 'compare')
	        .text(compare).on("change keyup paste", auto_grow)
	    )
	);
	row.append($('<td>')
	    .append($('<textarea>')
	        .attr('id', file)
	        .attr('class', 'user')
	        .text(user).on("change keyup paste", auto_grow)
	    )
	);

	return row;
}

function onLoadDocument() {
	var $result = $("#result");
	$("#original").on("change", importOriginal);
	$("#diff").on("change", importDiff);
	$("#compare").on("change", importCompare);
	$("#original").on("change", importUser);
	// $("#save").click(reconstructTable);
	$("#load").click(loadAllFiles);
	var textareas = $("textarea");
	textareas.each(function(index, element) {
		var input = $(this);
		input.on("change keyup paste", auto_grow);
	})

	
	$('textarea').autosize();
}

function auto_grow(element) {
	var textAreas = $(element.target).parent().parent().find("textarea");
	resizeTextAreas(textAreas);
}

function resizeTextAreas(textAreas) {
	var getHighestHeight = 0;
	textAreas.each(function(index, element) {
		if(getHighestHeight < element.clientHeight) {
			getHighestHeight = element.clientHeight;
		}
	});
	textAreas.each(function(index, element) {
		element.style.height = getHighestHeight + "px";
	});
}