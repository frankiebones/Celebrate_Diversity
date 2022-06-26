function init() {
    var selector = d3.select("#selDataset");
  
    d3.json("samples.json").then((data) => {
      console.log(data);
      var sampleNames = data.names;
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  })}
 
function optionChanged(newSample) {
    buildMetadata(newSample);
    buildCharts(newSample);
}

function buildMetadata(sample) {
    d3.json("samples.json").then((data) => { 
        var metadata = data.metadata;
        var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
        var result = resultArray[0];
        var PANEL = d3.select("#sample-metadata");
        
        // clear the current results
        PANEL.html("");

        // add filtered results
        /* PANEL.append("h6").text(Object.keys(result));
        PANEL.append("h6").text(Object.values(result)); */
        PANEL.append("h6").text(`ID: ${result.id}`);
        PANEL.append("h6").text(`AGE: ${result.age}`);
        PANEL.append("h6").text(`GENDER: ${result.gender}`);
        PANEL.append("h6").text(`ETHNICITY: ${result.ethnicity}`);
        PANEL.append("h6").text(`LOCATION: ${result.location}`);
        PANEL.append("h6").text(`TYPE: ${result.bbtype}`);
        PANEL.append("h6").text(`WASH FREQUENCY: ${result.wfreq}`);
    });
}

init();