
var graphData = [];
var graphData2 = [];
var minLevel = 13;
var maxLevel = 40;
var min = 0;
var max = 2147483647;

function createNewGraphData(name, graphData) {
    var graphIndex = 0;
    graphData.push({
        x: [],
        y: [],
        mode: 'lines',
        name: name
    });
    graphIndex = graphData.length - 1;
    return graphIndex;
}

var cache = []

function getCusotmLevelsTable() {
	var returnValue = "";
	maxLevel = parseInt(document.getElementsByTagName("input")[1].value);
	cache = [];
	cache[1] =     0;
	cache[2] =  1000;
	cache[3] =  2000;
	cache[4] =  3200;
	cache[5] =  4600;
	cache[6] =  6200;
	cache[7] =  8000;
	cache[8] = 10000;
	cache[9] = 12200;
	cache[10] =14700;
	cache[11] =17500;
	cache[12] =20600;
	// clvlCustom(40, 17500, 20600, 1.20, 0.051833, -2.84873, 26);
	clvlCustom(40, 17500, 20600, 1.20, 0.05, -2, 26);
	var startLevel = 35;
	for(var i=startLevel;i<=maxLevel;i++) {
		var factor = (startLevel - 1 + (-2)) * 0.05 - 0.0496*(i-startLevel)
		if(factor <= 1.10)
			factor = 1.10;
		var nextLevelExp = (cache[i-1] - cache[i-2]) * factor
		cache[i] = cache[i-1] + nextLevelExp;
	}
	
	// rounding
	for(var i=1;i<=maxLevel;i++) {
		if(cache[i]== 0)
			continue;
	  var numbers = Math.floor(Math.log10(cache[i]));
	  numbers = Math.floor(Math.pow(10, numbers-2));
	  var expDivided = cache[i]/numbers;
	  expDivided = Math.floor(expDivided);
	  expDivided = expDivided * numbers;
	  cache[i] = expDivided;
	}
	
	for(var i=1;i<=maxLevel;i++) {
	  returnValue += cache[i] + "\n";
	}
	document.getElementsByTagName("textarea")[0].value = returnValue;
	cache = [];
	return returnValue;
}

function getLevelsV20Table() {
	var returnValue = "";
	maxLevel = parseInt(document.getElementsByTagName("input")[1].value);
	cache = [];
	cache[1] =     0;
	cache[2] =  1000;
	cache[3] =  2000;
	cache[4] =  3200;
	cache[5] =  4600;
	cache[6] =  6200;
	cache[7] =  8000;
	cache[8] = 10000;
	cache[9] = 12200;
	cache[10] =14700;
	cache[11] =17500;
	cache[12] =20600;
	// clvlCustom(40, 17500, 20600, 1.20, 0.051833, -2.84873, 26);
	clvlCustom(25, 17500, 20600, 1.19937, 0.05, -2, 100); //     200 000
	clvlCustom(40, 17500, 20600, 1.19825, 0.05, -2, 100); //   3 000 000
	clvlCustom(50, 17500, 20600, 1.21650, 0.05, -2, 100); //  20 000 000
	clvlCustom(65, 17500, 20600, 1.19090, 0.05, -2, 100); // 300 000 000
		
	for(var i=1;i<=maxLevel;i++) {
	  returnValue += cache[i] + "\n";
	}
	document.getElementsByTagName("textarea")[0].value = returnValue;
	cache = [];
	return returnValue;
}

function roundTable() {
	var expTable = document.getElementsByTagName("textarea")[0].value.split("\n").filter(function(e){ return e.replace(/(\r\n|\n|\r)/gm,"")}).map(Number);
	var returnValue = "";
	// rounding
	for(var i=0;i<maxLevel;i++) {
		if(expTable[i]== 0)
			continue;
	  var numbers = Math.floor(Math.log10(expTable[i]));
	  numbers = Math.floor(Math.pow(10, numbers-2));
	  var expDivided = expTable[i]/numbers;
	  expDivided = Math.floor(expDivided);
	  expDivided = expDivided * numbers;
	  expTable[i] = expDivided;
	}
	
	for(var i=0;i<maxLevel;i++) {
	  returnValue += expTable[i] + "\n";
	}
	document.getElementsByTagName("textarea")[0].value = returnValue;
	return returnValue;
}

function getOriginalLevelsTable() {
	var returnValue = "";
	maxLevel = parseInt(document.getElementsByTagName("input")[1].value);
	cache = [];
	cache[1] =     0;
	cache[2] =  1000;
	cache[3] =  2000;
	cache[4] =  3200;
	cache[5] =  4600;
	cache[6] =  6200;
	cache[7] =  8000;
	cache[8] = 10000;
	cache[9] = 12200;
	cache[10] =14700;
	cache[11] =17500;
	cache[12] =20600;
	clvlCustom(maxLevel, 17500, 20600, 1.20, 0.10, -13, 25);
	
	for(var i=1;i<=maxLevel;i++) {
	  returnValue += cache[i] + "\n";
	}
	document.getElementsByTagName("textarea")[0].value = returnValue;
	cache = [];
	return returnValue;
}

function getOriginalWithoutGrowthLevelsTable() {
	var returnValue = "";
	maxLevel = parseInt(document.getElementsByTagName("input")[1].value);
	cache = [];
	cache[1] =     0;
	cache[2] =  1000;
	cache[3] =  2000;
	cache[4] =  3200;
	cache[5] =  4600;
	cache[6] =  6200;
	cache[7] =  8000;
	cache[8] = 10000;
	cache[9] = 12200;
	cache[10] =14700;
	cache[11] =17500;
	cache[12] =20600;
	clvlCustom(maxLevel, 17500, 20600, 1.20195, 0.10, -13, 100);
	
	for(var i=1;i<=maxLevel;i++) {
	  returnValue += cache[i] + "\n";
	}
	document.getElementsByTagName("textarea")[0].value = returnValue;
	cache = [];
	return returnValue;
}

function getLevelsTableByBAD() {
	var returnValue = "";
	maxLevel = parseInt(document.getElementsByTagName("input")[1].value);
	cache = [];
	cache[1] =     0;
	cache[2] =  1000;
	cache[3] =  2000;
	cache[4] =  3200;
	cache[5] =  4600;
	cache[6] =  6200;
	cache[7] =  8000;
	cache[8] = 10000;
	cache[9] = 12200;
	cache[10] =14700;
	cache[11] =17500;
	cache[12] =20600;
	clvlCustom(maxLevel, 17500, 20600, 1.20, 0.04, -1, 25);
	
	for(var i=1;i<=maxLevel;i++) {
	  returnValue += cache[i] + "\n";
	}
	document.getElementsByTagName("textarea")[0].value = returnValue;
	cache = [];
	return returnValue;
}

function calculateExpTable() {
	var expTable = document.getElementsByTagName("textarea")[0].value.split("\n").filter(function(e){ return e.replace(/(\r\n|\n|\r)/gm,"")}).map(Number);
	maxLevel = parseInt(document.getElementsByTagName("input")[1].value);
	var increase = parseInt(document.getElementsByTagName("input")[2].value);
	if(expTable.length < maxLevel) {
		for(var i=expTable.length;i<maxLevel;i++) {
			expTable.push(expTable[i-1] + increase);
		}
	}
	expTable.splice(0, 0, 0);
	return expTable;
}

function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = s + " ";
    return s;
}

function exportToPatch() {
	var expTable = document.getElementsByTagName("textarea")[0].value.split("\n").filter(function(e){ return e.replace(/(\r\n|\n|\r)/gm,"")}).map(Number);
	
	var definedLines = expTable.length;
	
	if(definedLines > 77) {
        window.alert("The patch supports user-defined levels up to level 77 only!");
        return 1;
    }
	
	for(var i = 0;i<expTable.length;i++) {
		if(expTable[i] > 2147483647) {
			window.alert("Level " + (i+1) + " exceeds 2147483647 exp!");
			return 1;
		}
	}
	
	var increase = parseInt(document.getElementsByTagName("input")[2].value);
	maxLevel = parseInt(document.getElementsByTagName("input")[1].value);
	expTable.splice(0, 0, 0);
	var definedLines = expTable.length;
	var returnValue = "";
	returnValue += " - &max_level     " + maxLevel + "\n\n";
	returnValue += " - &experience_table | \n   ";
	
	var highestExp = 0;
	for(var i=2;i<expTable.length;i++) {
	  if(highestExp < expTable[i]) 
	    highestExp = expTable[i];
	}
	var leadingSpaces = Math.log10(highestExp);
	
	
	for(var i=1;i<expTable.length;i++) {
	  returnValue += pad(expTable[i], leadingSpaces);
	  if(i<expTable.length-1) {
		returnValue += ", ";
	  } else {
		returnValue += "\n\n";
	  }
	  if(i%5 == 0 && i<expTable.length-1) {
		returnValue += "\n   ";
	  }
	}
	returnValue += " - &last_defined_level     " + (definedLines-1) + "\n";
	returnValue += " - &last_defined_level_exp     " + expTable[expTable.length-1] + "\n";
	returnValue += " - &after_last_defined_level_exp_increase     " + increase + "\n";
	document.getElementsByTagName("textarea")[1].value = returnValue;
	return returnValue;
}

function clvlCustom(n, level11exp, level12exp, fixedCoefficent, growthCoefficient, levelModifier, nextPhaseLevel) {
	if(!nextPhaseLevel)
		nextPhaseLevel = 25;
    if(cache[n]) return cache[n]
    var xp = Math.floor(lvlCustom(n, level11exp, level12exp, fixedCoefficent, growthCoefficient, levelModifier, nextPhaseLevel))
    cache[n] = xp
    return xp
}

function lvlCustom(n, level11exp, level12exp, fixedCoefficent, growthCoefficient, levelModifier, nextPhaseLevel) {
    if (n==11) return level11exp
    if (n==12) return level12exp

    var preLevel = clvlCustom(n-1, level11exp, level12exp, fixedCoefficent, growthCoefficient, levelModifier, nextPhaseLevel)
    var prePreLevel = clvlCustom(n-2, level11exp, level12exp, fixedCoefficent, growthCoefficient, levelModifier, nextPhaseLevel)

    if (n<nextPhaseLevel) return fixedCoefficent * (preLevel - prePreLevel) + preLevel

    var expCoefficient = (n+levelModifier) * growthCoefficient
    return expCoefficient * (preLevel - prePreLevel) + preLevel
}

function clearPlot() {
    graphData = []
    graphData2 = []

    graphIndex = createNewGraphData("Max Experience", graphData);
    graphIndex = createNewGraphData("", graphData2);
    graphData[graphIndex].x.push(minLevel);
    graphData[graphIndex].y.push(2147483647);
    graphData[graphIndex].x.push(maxLevel);
    graphData[graphIndex].y.push(2147483647);

    var layout = getLayout("Total Accumulated Exp")
    Plotly.purge('graph');
    Plotly.plot('graph', graphData, layout);
    var layout = getLayout("Needed Exp for next Level");
    Plotly.purge('graph2');
    Plotly.plot('graph2', graphData2, layout);
}

function showOriginal() {
    plot("Original Curve",17500,20600,1.2,0.1,-13,13,40);
}

function addPlot() {
    var level11exp = parseInt(document.getElementsByTagName("input")[1].value);
    var level12exp = parseInt(document.getElementsByTagName("input")[2].value);
    var fixedCoefficent = parseFloat(document.getElementsByTagName("input")[3].value);
    var growthCoefficient = parseFloat(document.getElementsByTagName("input")[4].value);
    var levelModifier = parseInt(document.getElementsByTagName("input")[5].value);
    maxLevel = parseInt(document.getElementsByTagName("input")[6].value);

    plot("f="+fixedCoefficent+", g="+growthCoefficient+", l="+levelModifier, level11exp,level12exp,fixedCoefficent,growthCoefficient,levelModifier,minLevel,maxLevel);
}

function addPlotByTable() {
    var expTable = calculateExpTable();
    maxLevel = parseInt(document.getElementsByTagName("input")[1].value);
	var name = document.getElementsByTagName("input")[3].value;
	
    plotDirect(name, expTable, maxLevel);
}

function setLogarithmic() {
    layout = getLayout();
    Plotly.relayout('graph', layout);
    Plotly.relayout('graph2', layout);
}

function getLayout(title) {
    var layout = {
      title: title,
      width: 800,
      height: 550,
      xaxis: {
        range: [minLevel, maxLevel], 
        autorange: false
      },
      yaxis: {
        type: getLogarithmic(),
        autorange: true,
      }
    };
    return layout;
}

function getLogarithmic() {
    if(!document.getElementsByTagName("input")[0])
        return "linear";
    var log = document.getElementsByTagName("input")[0].checked;
    if(log) {
        return "log";
    } else {
        return "linear";
    }
}

function plot(name, level11exp, level12exp, fixedCoefficent, growthCoefficient, levelModifier, minLevel, maxLevel) {
    if(checkData(level11exp, level12exp, fixedCoefficent, growthCoefficient, levelModifier, minLevel, maxLevel))
        return 0
    cache = []
    var graphIndex = createNewGraphData(name, graphData);
    var graphIndex2 = createNewGraphData(name, graphData2);

    for(var i=minLevel;i<=maxLevel;i++) {
        graphData[graphIndex].x.push(i);
        clvlCustom(i, level11exp, level12exp, fixedCoefficent, growthCoefficient, levelModifier)
        if(cache[i-1]) {
            graphData2[graphIndex2].x.push(i);
            graphData2[graphIndex2].y.push(cache[i]-cache[i-1]);
        }
        graphData[graphIndex].y.push(cache[i]);
    }

    min = clvlCustom(minLevel, level11exp, level12exp, fixedCoefficent, growthCoefficient, levelModifier)
    max = clvlCustom(maxLevel, level11exp, level12exp, fixedCoefficent, growthCoefficient, levelModifier)
    var layout = getLayout("Total Accumulated Exp");
    Plotly.purge('graph');
    Plotly.plot('graph', graphData, layout);
    layout = getLayout("Needed Exp for next Level");
    Plotly.purge('graph2');
    Plotly.plot('graph2', graphData2, layout);
}

function plotDirect(name, expTable, maxLevel) {
    if(checkDataDirect(expTable, maxLevel))
        return 0
    cache = []
    var graphIndex = createNewGraphData(name, graphData);
    var graphIndex2 = createNewGraphData(name, graphData2);

    for(var i=1;i<=maxLevel;i++) {
        graphData[graphIndex].x.push(i);
        if(i>1) {
            graphData2[graphIndex2].x.push(i);
            graphData2[graphIndex2].y.push(expTable[i]-expTable[i-1]);
        }
        graphData[graphIndex].y.push(expTable[i]);
    }
    var layout = getLayout("Total Accumulated Exp");
    Plotly.purge('graph');
    Plotly.plot('graph', graphData, layout);
    layout = getLayout("Needed Exp for next Level");
    Plotly.purge('graph2');
    Plotly.plot('graph2', graphData2, layout);
}

function checkDataDirect(expTable, maxLevel) {
	if(maxLevel > 250) {
        window.alert("The patch supports up to maxLevel 250 only!");
        return 1
    }
	
	var expTable2 = document.getElementsByTagName("textarea")[0].value.split("\n").filter(function(e){ return e.replace(/(\r\n|\n|\r)/gm,"")}).map(Number);
	var definedLines = expTable2.length;
	
    if(definedLines > maxLevel) {
        window.alert("Experience Table does have " + definedLines + " lines but max level is " + maxLevel + "!");
        return 1
    }
	if(expTable.length == 0) {
		window.alert("There are no levels!");
		return 1
	}
	if(expTable[0] != 0) {
		window.alert("Level 1 needs to be 0 exp!");
		return 1
	}
	var previousExp = 0;
	for(var i=2;i<=maxLevel;i++) {
		if(expTable[i] <= previousExp) {
			window.alert("The experience table needs to be strictly increasing!");
			return 1
		}
		previousExp = expTable[i];
	}
    return 0
}

function checkData(level11exp, level12exp, fixedCoefficent, growthCoefficient, levelModifier, minLevel, maxLevel) {
    if(levelModifier > 127 || levelModifier < -128) {
        window.alert("Level Modifier is a byte. It needs to reside between -128 and 127!!");
        return 1
    }
    return 0
}

clearPlot()
showOriginal()



window.onload = function() { 
  var txt = document.getElementsByTagName('textarea')[0]; 
  var func = function() { 
    var expTable = document.getElementsByTagName("textarea")[0].value.split("\n").filter(function(e){ return e.replace(/(\r\n|\n|\r)/gm,"")}).map(Number);
	var maxLevel = parseInt(document.getElementsByTagName("input")[1].value);
	document.getElementsByTagName("input")[1].value = Math.max(maxLevel, expTable.length);
	document.getElementById("afterLevel").innerHTML = "incremental increase after level "+expTable.length+":";
	document.getElementsByTagName("input")[2].disabled = expTable.length == maxLevel;
  }
  txt.onkeyup = func;
  txt.onblur = func;
  
  var txt2 = document.getElementsByTagName("input")[1]; 
  var func2 = function() { 
    var expTable = document.getElementsByTagName("textarea")[0].value.split("\n").filter(function(e){ return e.replace(/(\r\n|\n|\r)/gm,"")}).map(Number);
	var maxLevel = parseInt(document.getElementsByTagName("input")[1].value);
	document.getElementsByTagName("input")[2].disabled = expTable.length == maxLevel;
  }
  txt2.onkeyup = func2;
  txt2.onblur = func2;
}
