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

    var metaArray = data.metadata;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var metaSample = metaArray.filter(metaObj => metaObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var metaResult = metaSample[0];

    var washFreq = metaResult.wfreq;
    var wfreq = parseFloat(washFreq);
    
    console.log(wfreq);

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var yticks = otu_ids.slice(0,10).map(ids => `OTU ${ids} `).reverse();

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
      plot_bgcolor: 'rgba(0,0,0,0)',
      paper_bgcolor: 'rgba(0,0,0,0)'
    };
    
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker: {
        color: otu_ids,
        size: sample_values,
        colorscale: 'Earth'
      }
    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: {title: "OTU ID"},
      hovermode: "closest"
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 

    

    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      value: wfreq,
      title: { text: "Bellybutton Washing Frequency" },
      type: "indicator",
      mode: "gauge+number",
      delta: { reference: 2 },
      gauge: { 
        axis: { 
          range: [null, 10],
          tickwidth: 1,
          tickcolor: "Peru"  
        }, 
        bgcolor: "Peru",
        steps: [
          { range: [0,2], color: "GreenYellow" },
          { range: [2,4], color: "Chartreuse" },
          { range: [4,6], color: "Lime" },
          { range: [6,8], color: "LimeGreen" },
          { range: [8,10], color: "Green" }
        ]
      }
    }];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 500, 
      height: 500
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}
