// Creating function for Data plotting (Bar, gauge, bubble)
function createPlots(id) {
    // Retreive data from input file
    d3.json("data/samples.json").then((data)=> {
        console.log(data)

        var wfreq = data.metadata.map(d => d.wfreq);
        var samples = data.samples.filter(s => s.id.toString() === id)[0];
        var sampleVals = samples.sample_values.slice(0, 10).reverse();
        var topTen = (samples.otu_ids.slice(0, 10)).reverse();
        var otuID = topTen.map(d => "OTU " + d);
        var labels = samples.otu_labels.slice(0, 10);

      //   console.log(`Sample Values: ${samplevalues}`)
        var trace = {
            x: sampleVals,
            y: otuID,
            text: labels,
            marker: {
              color: 'rgb(14,125,43)'},
            type:"bar",
            orientation: "h",
        };

        // Data variable
        var data = [trace];

        // Layout variable
        var layout = {
            title: "Top 10",
            yaxis:{
                tickmode:"linear",
            },
            margin: {
                l: 100,
                r: 100,
                t: 100,
                b: 30
            }
        };

        // Horizontal Bar chart
        Plotly.newPlot("bar", data, layout);

        //console.log(`ID: ${samples.otu_ids}`)

        // Bubble chart
        var trace2 = {
            x: samples.otu_ids,
            y: samples.sample_values,
            mode: "markers",
            marker: {
                size: samples.sample_values,
                color: samples.otu_ids
            },
            text: samples.otu_labels

        };

        // Layout for the bubble chart
        var layout2 = {
            xaxis:{title: "OTU ID"},
            height: 600,
            width: 1000
        };

        // creating data variable
        var data2 = [trace2];

        // create the bubble plot
        Plotly.newPlot("bubble", data2, layout2);

        // The guage chart

        var data3 = [
          {
          domain: { x: [0, 1], y: [0, 1] },
          value: parseFloat(wfreq),
          title: { text: `Belly Button Washing Frequency `, font: {size: 20} },
          type: "indicator",

          mode: "gauge+number+delta",
          gauge: { axis: { range: [null, 9] },
            bar: { color: "darkblue"},
            bgcolor: "orange",
            borderwidth: 2,
            bordercolor: "gray",
            steps: [
              { range: [0, 2], color: "lightblue" },
              { range: [2, 4], color: "cyan" },
              { range: [4, 6], color: "teal" },
              { range: [6, 8], color: "lightgreen" },
              { range: [8, 10], color: "lime" },
            ]}

          }
        ];
        var layout3 = {
            width: 700,
            height: 600,
            margin: { t: 20, b: 40, l:100, r:100 }
          };
        Plotly.newPlot("gauge", data3, layout3);
      });
  }
// Function to pull in metadata
function metaData(id) {
    // read in data
    d3.json("data/samples.json").then((data)=> {

        // Retreive the metadata
        var metadata = data.metadata;
        //console.log(metadata)
        // filter meta data
        var result = metadata.filter(meta => meta.id.toString() === id)[0];
        var demographics = d3.select("#sample-metadata");
        // empty the current demographic data before pulling in new info
        demographics.html("");
        Object.entries(result).forEach((key) => {
                demographics.append("h5").text(key[0] + ": " + key[1] + "\n");
        });
    });
}

// create the function for the change event
function optionChanged(id) {
    createPlots(id);
    metaData(id);
}

// Initial rendering of charts
function init() {
    // Dropdown menu
    var dropdown = d3.select("#selDataset");
    d3.json("data/samples.json").then((data)=> {
        console.log(data)
        // data to dropdown
        data.names.forEach(function(name) {
            dropdown.append("option").text(name).property("value");
        });
        // Display data
        createPlots(data.names[0]);
        metaData(data.names[0]);
    });
}

init();
