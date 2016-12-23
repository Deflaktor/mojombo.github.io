
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

function clvlCustom(n, level11exp, level12exp, fixedCoefficent, growthCoefficient, levelModifier) {
    if(cache[n]) return cache[n]
    var xp = Math.floor(lvlCustom(n, level11exp, level12exp, fixedCoefficent, growthCoefficient, levelModifier))
    cache[n] = xp
    return xp
}

function lvlCustom(n, level11exp, level12exp, fixedCoefficent, growthCoefficient, levelModifier) {
    if (n==11) return level11exp
    if (n==12) return level12exp

    var preLevel = clvlCustom(n-1, level11exp, level12exp, fixedCoefficent, growthCoefficient, levelModifier)
    var prePreLevel = clvlCustom(n-2, level11exp, level12exp, fixedCoefficent, growthCoefficient, levelModifier)

    if (n<25) return fixedCoefficent * (preLevel - prePreLevel) + preLevel

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

function checkData(level11exp, level12exp, fixedCoefficent, growthCoefficient, levelModifier, minLevel, maxLevel) {
    if(levelModifier > 127 || levelModifier < -128) {
        window.alert("Level Modifier is a byte. It needs to reside between -128 and 127!!");
        return 1
    }
    return 0
}

clearPlot()
showOriginal()