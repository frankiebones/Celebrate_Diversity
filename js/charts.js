function init() {
  // create a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // populate select options from samples.json
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // use first sample from list to build initial plot
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// initialize dashboard
init();

function optionChanged(newSample) {
  // fetch new data upon new sample selection
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    
    // filter data for object with desired sample number (this.value) in index.html
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // select panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // clear any current results
    PANEL.html("");

    // use `Object.entries` to add each key and value pair to panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samplesArray = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var currentSample = samplesArray.filter(sampleObj => sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var sampleResult = currentSample[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = sampleResult.otu_ids;
    var otu_labels = sampleResult.otu_labels;
    var sample_values = sampleResult.sample_values;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otu_ids.slice(0,10).map(ids => `OTU ${ids}`).reverse();

    // 8. Create the trace for the bar chart. 
    var barData = [{
      type: "bar",
      x: sample_values.slice(0,10).reverse(),
      y: yticks,
      text: otu_labels.slice(0,10).reverse(),
      orientation: "h"
    }];
    
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top Ten Bacterial Strains",
      xaxis: {title: "Sample Values"},
      yaxis: {title: "ID's"},
      plot_bgcolor: 'rgb(192,192,192)',
      paper_bgcolor: 'rgb(192,192,192)'
    };
    
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

  });
}
