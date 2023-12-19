// Set up the map container dimensions
let width = window.innerWidth * 0.6; // 80% of viewport width
let height = window.innerHeight * 0.75; // 80% of viewport height
let isAtBottom = false;

document.getElementById('scrollButton').addEventListener('click', () => {
    if (isAtBottom) {
        window.scrollTo({top: 0, behavior: 'smooth'});
    } else {
        window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth'});
    }
    isAtBottom = !isAtBottom;
});

// Append an SVG container to the body
const svg = d3.select("#map")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

// Create a projection
const projection = d3.geoAlbersUsa()
    .scale(1000)
    .translate([width / 2, height / 2]);

// Create a path generator
const path = d3.geoPath().projection(projection);

// Define a zoom behavior
const zoom = d3.zoom()
    .scaleExtent([1, 8])
    .on("zoom", event => {
        handleSemanticZoom(event);
        zoomed(event);
    });
svg.append("defs")
    .append("filter")
    .attr("id", "drop-shadow")
    .append("feDropShadow")
    .attr("dx", 1)
    .attr("dy", 1)
    .attr("stdDeviation", 2);

svg.append("rect")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("fill", "#B0A2A2")
    .attr("opacity", 0.5);

// Create a group for the map features
const mapGroup = svg.append("g")
    .style("filter", "url(#drop-shadow)");

// Load the GeoJSON data and CSV data
function updateMap(selectedYears, selectedSchoolTypes) {
    d3.json("data/gz_2010_us_050_00_5m.json").then(geojson => {
        // Load CSV data
        d3.csv("data/output_file.csv").then(csvdata => {
            csvdata.forEach(d => {
                d.Year = +d.Year;
                d.overall_poverty_perc = +d.overall_poverty_perc;
            });

            // Filter data based on selected filters
            let filteredData = csvdata;
            if (selectedYears.length > 0 || selectedSchoolTypes.length > 0) {
                const selectedYearsInt = selectedYears.map(year => parseInt(year, 10));

                filteredData = filteredData.filter(d => {
                    const yearCondition = selectedYears.length === 0 || selectedYearsInt.includes(d.Year);
                    const schoolLevelCondition = selectedSchoolTypes.length === 0 || selectedSchoolTypes.includes(d.School_Level);
                    return yearCondition && schoolLevelCondition;
                });
            }

            const aggregatedData = d3.rollups(
                filteredData,
                v => v.length,
                d => d.state_code
            );

            const aggregatedDataMap = new Map(aggregatedData.map(([state, shootingsCount]) => [state, shootingsCount]));

            const colorScale = d3.scaleSequential()
                .interpolator(d3.interpolateReds)
                .domain([0, d3.max(aggregatedData, ([, count]) => count)]);

            geojson.features.forEach(state => {
                const stateName = state.properties.STATE;
                const countyData = csvdata.find(d => d.state_code === stateName);

                if (countyData) {
                    state.properties.povertyPercentage = countyData.overall_poverty_perc;
                    state.properties.shootingsCount = aggregatedDataMap.get(stateName) || 0;
                    state.properties.statename=countyData.name;

                } else {
                    state.properties.povertyPercentage = 0;
                    state.properties.shootingsCount = 0;
                }
            });
console.log(geojson.features);

            mapGroup.selectAll("path")
                .data(geojson.features)
                .join("path")
                .attr("d", path)
                .style("fill", d => colorScale(d.properties.shootingsCount))
                .style("stroke", "white")
                .on("mouseover", handleMouseOver)
                .on("mouseout", handleMouseOut)
                .on("click", zoomToCounty);


            function handleMouseOver(event, d) {
                const tooltip = d3.select("#tooltip");
                const zoomLevel = d3.zoomTransform(svg.node()).k;

                // Show state-level information in tooltip if not clicked on a county
                if (zoomLevel < 2) {
                    tooltip.transition().duration(200).style("opacity", 0.9);

                    const tooltipX = event.clientX + 10;
                    const tooltipY = event.clientY + window.scrollY + 10;
                    console.log(d.properties);
                    tooltip.html(
                        `${d.properties.statename}<br>No. of Shootings: ${d.properties.shootingsCount}<br>` +
                        `Poverty Percentage: ${d.properties.povertyPercentage || 'N/A'}%`
                    )
                        .style("left", `${tooltipX}px`)
                        .style("top", `${tooltipY}px`);
                } else {
                    // Hide tooltip when zoomed in on a county
                    tooltip.transition().duration(200).style("opacity", 0.9);

                    const tooltipX = event.clientX + 10;
                    const tooltipY = event.clientY + window.scrollY + 10;
                    console.log(d.properties);
                    tooltip.html(
                        `${d.properties.NAME}<br>No. of Shootings: ${d.properties.shootingsCount}<br>` +
                        `Poverty Percentage: ${d.properties.povertyPercentage || 'N/A'}%`
                    )
                        .style("left", `${tooltipX}px`)
                        .style("top", `${tooltipY}px`);
                }
            }

            function handleMouseOut() {
                d3.select("#tooltip").transition().duration(500).style("opacity", 0);
            }

            function zoomToCounty(event, d) {
                const [[x0, y0], [x1, y1]] = path.bounds(d);
                event.stopPropagation();
                svg.transition().duration(750).call(
                    zoom.transform,
                    d3.zoomIdentity
                        .translate(width / 2, height / 2)
                        .scale(Math.min(8, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height)))
                        .translate(-(x0 + x1) / 2, -(y0 + y1) / 2)
                );
            }

            // Add double click event listener for zooming out
            svg.call(zoom).on("dblclick.zoom", zoomOut);

            d3.select("#map")
                .append("div")
                .attr("id", "tooltip")
                .style("opacity", 0);
        });
        d3.json("data/gz_2010_us_040_00_5m.json").then(function(additionalGeojsonData) {
            // Append the additional GeoJSON features to the SVG
            mapGroup.selectAll("path.additional")
                .data(additionalGeojsonData.features)
                .enter().append("path")
                .attr("class", "additional")
                .attr("d", path)
                .style("fill", "none")  // Adjust as needed
                .style("stroke", "black");  // Adjust as needed
        });
    });
    
    
}

// Function to handle zoom out
function zoomOut() {
    svg.transition().duration(750).call(
        zoom.transform,
        d3.zoomIdentity
            .translate(0,0)
            .scale(1)
    );
}

// Function to handle zoom
function zoomed(event) {
    mapGroup.attr("transform", event.transform);
}

// Function to handle semantic zooming
function handleSemanticZoom(event) {
    const zoomLevel = event.transform.k;

    if (zoomLevel < 2) {
        const zoomLevelInfo = d3.select("#zoom-level-info");
        zoomLevelInfo.html("State-level Information");
    } else {
        const zoomLevelInfo = d3.select("#zoom-level-info");
        zoomLevelInfo.html("County-level Information");
    }
}
function populateDropdown(dropdownId, values) {
    // Empty the dropdown
    $(`#${dropdownId}`).empty();

    // Sort and append the values to the dropdown
    values.forEach(value => {
        $(`#${dropdownId}`).append($('<option>', {
            value: value,
            text: value
        }));
    });
}



// Initialize the map with default filters
d3.csv("data/output_file.csv").then(csvData => {
    const uniqueYears = Array.from(new Set(csvData.map(d => +d.Year))).sort((b, a) => a - b);
    const uniqueSchoolTypes = Array.from(new Set(csvData.map(d => d.School_Level))).sort();
    console.log(uniqueYears);  
    updateMap(uniqueYears, uniqueSchoolTypes);
    $(document).ready(function() {
        $("#yearSlider").slider({
            range: true,
            min: Math.min(...uniqueYears),
            max: Math.max(...uniqueYears),
            values: [Math.min(...uniqueYears), Math.max(...uniqueYears)],
            slide: function(event, ui) {
                $("#yearSliderMin").text(ui.values[0]);
                $("#yearSliderMax").text(ui.values[1]);
            },
            stop: function(event, ui) {
                const selectedYears = ui.values;
                const selectedSchoolTypes = $("#schoolTypeDropdown").val();
                updateMap(selectedYears, selectedSchoolTypes);

                localStorage.setItem('selectedYears', JSON.stringify(selectedYears));
            }
        });
    
    $("#yearSliderMin").text($("#yearSlider").slider("values", 0));
    $("#yearSliderMax").text($("#yearSlider").slider("values", 1));
    /* populateDropdown("yearDropdown", uniqueYears); */
    });
    populateDropdown("schoolTypeDropdown", uniqueSchoolTypes);
    
    $("#yearDropdown, #schoolTypeDropdown").multiselect({
        noneText: `Select ${$("#yearDropdown").length ? "years" : "school level"}`,
        selectAll: false,
        single: true
    });

    $("#yearDropdown, #schoolTypeDropdown").on("change", function () {
        const selectedYears = $("#yearDropdown").val();
        const selectedSchoolTypes = $("#schoolTypeDropdown").val();
        updateMap(selectedYears, selectedSchoolTypes);
    });
    
});

