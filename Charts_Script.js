// Set the dimensions and margins of the graph
const margin = { top: 0.05 * window.innerHeight, right: 0.03 * window.innerWidth, bottom: 0.05 * window.innerHeight, left: 0.03 * window.innerWidth };
const w1 = 0.35 * window.innerWidth - margin.left - margin.right;
const h1 = 0.4 * window.innerHeight - margin.top - margin.bottom;
const w2 = 0.6 * window.innerWidth - margin.left - margin.right;
const h2 = 0.3 * window.innerHeight - margin.top - margin.bottom;

// Define centerWidth
const centerWidth = 0;
let selectedYear; //Update 2

const lineChartContainer = d3.select("#lineChartSvg")
    .attr("width", w2 + margin.left + margin.right)
    .attr("height", h2 + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

const barChartContainer = d3.select("#barChartSvg")
    .attr("width", w1 + margin.left + margin.right)
    .attr("height", h1 + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

const schoolLevelChartContainer = d3.select("#schoolLevelChartSvg")
    .attr("width", w1 + margin.left + margin.right)
    .attr("height", h1 + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

const monthsChartContainer = d3.select("#monthsChartSvg")
    .attr("width", w1 + margin.left + margin.right)
    .attr("height", h1 + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Update 1
// Add a new container for the cities bar chart
const citiesChartContainer = d3.select("#citiesChartSvg")
    .attr("width", w1 + margin.left + margin.right)
    .attr("height", h1 + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

const tooltip = d3.select("#tooltip")
    .style("opacity", 0.9)
    .style("position", "absolute")  // Adjust position to absolute
    .style("pointer-events", "none")  // Avoid capturing events by the tooltip
    .style("background", "white");

d3.csv("data/output_file.csv").then(data => {
    // Your existing data processing code
    data.forEach(d => {
        d.Year = +d.Year;
    });

    const countsByYear = Array.from(d3.group(data, d => d.Year), ([year, values]) => ({
        year: +year,
        number: values.length,
        names: values.map(d => d.name)
    }));

    countsByYear.sort((a, b) => a.year - b.year);

    const x = d3.scaleLinear().domain([1965, 2025]).range([0, w2]);
    const y = d3.scaleLinear().domain([0, d3.max(countsByYear, d => d.number)]).range([h2, 0]);

    lineChartContainer.selectAll(".line-segment")
        .data(countsByYear.slice(0, -1))
        .enter().append("line")
        .attr("class", "line-segment")
        .attr("x1", d => x(d.year))
        .attr("y1", d => y(d.number))
        .attr("x2", (d, i) => x(countsByYear[i + 1].year))
        .attr("y2", (d, i) => y(countsByYear[i + 1].number))
        .attr("stroke", "steelblue")
        .attr("stroke-w2", 2);

    lineChartContainer.selectAll(".dot")
        .data(countsByYear)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("cx", d => x(d.year))
        .attr("cy", d => y(d.number))
        .attr("r", 5)
        .style("opacity", 0.7)
        .on("mouseover", function (event, d) {
            //const [xMouse, yMouse] = d3.pointer(event);
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);

            tooltip.html(`Year: ${d.year}<br>Incidents: ${d.number}`)
                .style("left", (event.clientX+10+centerWidth)+ "px")
                .style("top", (event.clientY+window.scrollY)+ "px");
                
                
                   
        })
        .on("mousemove", function (event, d) {
            //const [xMouse, yMouse] = d3.pointer(event);
            tooltip.html(`Year: ${d.year}<br>Incidents: ${d.number}`)
                //.style("left", `${xMouse + margin.left}px`)
                //.style("top", `${yMouse + margin.top}px`);
                .style("left", (event.clientX+10+centerWidth)+ "px")
                .style("top", (event.clientY+window.scrollY)+ "px");
                
        })
        
        .on("mouseout", () => {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });
        
        function initializeGraphs() {
            // Set up default data
            const defaultData = data;  // Replace with your default data
            const selectedState = 'USA';
            /* const defaultState = data.filter(entry => entry.name === "California"); */
            // Call your graph rendering functions with the default data
            renderBarGraph(defaultData);
            renderSchoolLevelBarChart(defaultData);
            renderMonthsBarChart(defaultData);
            renderCitiesBarChart(defaultData, selectedState);
            // Add similar calls for your other charts...
        
            // Set up default configurations (if any)
            // ...
        }
        initializeGraphs();

        function updateBarCharts() {
            // Retrieve the stored range slider values
            let rangeSliderValues = JSON.parse(localStorage.getItem('rangeSliderValues'));
        
            // Filter the data based on the range slider values
            let filteredData = data.filter(d => d.Year >= rangeSliderValues[0] && d.Year <= rangeSliderValues[1]);
        
            // Update the bar charts
            renderBarGraph(filteredData);
            renderSchoolLevelBarChart(filteredData);
            renderMonthsBarChart(filteredData);
        }
        
        // Call the function whenever the range slider values change
        $("#yearSlider").on("slidechange", function(event, ui) {
            // Store the range slider values
            localStorage.setItem('rangeSliderValues', JSON.stringify(ui.values));
        
            // Update the bar charts
            updateBarCharts();
        });
            

    lineChartContainer.append("g")
        .attr("transform", `translate(0,${h2})`)
        .call(d3.axisBottom(x)
            .tickValues(d3.range(1965, 2026, 5))
            .tickFormat(d3.format("d"))
            .tickPadding(10)
            .tickSize(5)
        )
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("transform", "rotate(0)");

    /* lineChartContainer.append("text")
        .attr("transform", `translate(${w2 / 2},${h2 + margin.top})`)
        .style("text-anchor", "middle")
        .text("Years"); */

    lineChartContainer.append("g")
        .call(d3.axisLeft(y));

    lineChartContainer.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - h2 / 2)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Total Number of Incidents");

    const startYearDropdown = $("#yearSlider").slider("values", 0);
    const endYearDropdown = $("#yearSlider").slider("values", 1);
    
    const uniqueYears = Array.from(new Set(countsByYear.map(d => d.year)));

    uniqueYears.forEach(year => {
        const option = document.createElement("option");
        option.value = year;
        option.text = year;
        startYearDropdown.add(option.cloneNode(true));
        endYearDropdown.add(option);
    });

    startYearDropdown.addEventListener("input", updateGraph);
    endYearDropdown.addEventListener("input", updateGraph);

    function getRangeSliderValues() {
        // Retrieve the stored range slider values
        return JSON.parse(localStorage.getItem('rangeSliderValues'));
    }

    function updateGraph() {
        const startYear = +startYearDropdown.value;
        const endYear = +endYearDropdown.value;

        const filteredData = countsByYear.filter(d => d.year >= startYear && d.year <= endYear);
        const totalIncidents = d3.sum(filteredData, d => d.number);

        updateGraphElements(filteredData);
        updateSelectionInfo(startYear, endYear, totalIncidents);
    }

    function updateSelectionInfo(startYear, endYear, totalIncidents) {
        const selectionInfo = document.getElementById("selectionInfo");
        selectionInfo.innerHTML = `Selected Range: ${startYear} - ${endYear}<br>Total Incidents: ${totalIncidents}`;
    }

    function updateGraphElements(data) {
        lineChartContainer.selectAll(".dot")
            .classed("highlighted", d => data.some(filtered => filtered.year === d.year));

        lineChartContainer.select(".shaded-region").remove();

        lineChartContainer.insert("rect", ":first-child")
            .attr("class", "shaded-region")
            .attr("x", x(+startYearDropdown.value))
            .attr("y", 0)
            .attr("width", x(+endYearDropdown.value) - x(+startYearDropdown.value))
            .attr("height", h2)
            .attr("fill", "steelblue")
            .attr("opacity", 0.3);
    }

    // ...

    function renderBarGraph(data) {
        barChartContainer.selectAll("*").remove();
        let rangeSliderValues = getRangeSliderValues();

        // Filter the data based on the range slider values
        let selectedData = data.filter(d => d.Year >= rangeSliderValues[0] && d.Year <= rangeSliderValues[1]);

        // Your existing bar chart rendering code
        const countsByState = Array.from(d3.group(selectedData, d => d.name), ([state, values]) => ({
            state: state || 'Unknown',
            number: values.length
        }));

        countsByState.sort((a, b) => b.number - a.number);

        const top5States = countsByState.slice(0, 5);

        const xBar = d3.scaleBand()
            .domain(top5States.map(d => d.state))
            .range([0, w1 - centerWidth])
            .padding(0.1);

        const yBar = d3.scaleLinear()
            .domain([0, d3.max(top5States, d => d.number)])
            .range([h1, 0]);

            barChartContainer.selectAll(".bar")
                .data(top5States)
                .join(
                    enter => enter.append("rect")
                        .attr("class", "bar")
                        .attr("x", d => xBar(d.state))
                        .attr("width", xBar.bandwidth())
                        .attr("y", d => yBar(d.number))  // Set the initial y position based on the data
                        .attr("height", d => h1 - yBar(d.number))  // Set the initial height based on the data
                        .attr("fill", "rgb(70, 180, 98)"),
                    update => update
                        .call(update => update.transition()  // Add a transition
                            .duration(1000)  // Transition duration is 1000ms
                            .attr("x", d => xBar(d.state))
                            .attr("width", xBar.bandwidth())
                            .attr("y", d => yBar(d.number))  // Update the y position based on the new data
                            .attr("height", d => h1 - yBar(d.number))),  // Update the height based on the new data
                    exit => exit
                        .call(exit => exit.transition()  // Add a transition
                            .duration(1000)  // Transition duration is 1000ms
                            .attr("y", h1)  // Move to the bottom of the chart
                            .attr("height", 0)  // Final height is 0
                            .remove())
                )
            //Update 1
            .on("click", function (event, d) {
                const selectedState = d.state;
                
                const citiesInState = data.filter(entry => entry.name === selectedState);
        
                renderCitiesBarChart(citiesInState, selectedState);
            })
            .on("mouseover", function (event, d) {
                //const [xMouse, yMouse] = d3.pointer(event);
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);

                tooltip.html(`State: ${d.state}<br>Incidents: ${d.number}`)
                    //.style("left", `${xMouse + margin.left + centerWidth}px`)
                    //.style("top", `${yMouse + margin.top}px`);
                    .style("left", (event.clientX+10+centerWidth)+ "px")
                    .style("top", (event.clientY+window.scrollY)+ "px");
            })
            .on("mouseout", () => {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

        // ...

        barChartContainer.append("g")
            .attr("transform", `translate(0,${h1})`)
            .call(d3.axisBottom(xBar))
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("transform", "rotate(-45)");

        barChartContainer.append("g")
            .call(d3.axisLeft(yBar));

        barChartContainer.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - h1 / 2)
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Total Number of Incidents");

        barChartContainer.append("text")
            .attr("x", (w1 / 2))             
            .attr("y", 0 - (margin.top / 2))
            .attr("text-anchor", "middle")  
            .style("font-size", "24px") 
            .style("text-decoration", "underline")  
            .text("Top 5 States with Most Incidents");
    }

    function renderSchoolLevelBarChart(data) {
        schoolLevelChartContainer.selectAll("*").remove();
        let rangeSliderValues = getRangeSliderValues();

        // Filter the data based on the range slider values
        let selectedData = data.filter(d => d.Year >= rangeSliderValues[0] && d.Year <= rangeSliderValues[1]);

        // Your existing school level bar chart rendering code
        const countsBySchoolLevel = Array.from(d3.group(selectedData, d => d.School_Level), ([schoolLevel, values]) => ({
            schoolLevel: schoolLevel || 'Unknown',
            number: values.length
        }));
    
        countsBySchoolLevel.sort((a, b) => b.number - a.number);
    
        const xSchoolLevel = d3.scaleBand()
            .domain(countsBySchoolLevel.map(d => d.schoolLevel))
            .range([0, w1 - centerWidth])
            .padding(0.1);
    
        const ySchoolLevel = d3.scaleLinear()
            .domain([0, d3.max(countsBySchoolLevel, d => d.number)])
            .range([h1, 0]);
    
        schoolLevelChartContainer.selectAll(".bar")
            .data(countsBySchoolLevel)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", d => xSchoolLevel(d.schoolLevel))
            .attr("width", xSchoolLevel.bandwidth())
            .attr("y", d => ySchoolLevel(d.number))
            .attr("height", d => h1 - ySchoolLevel(d.number))
            .attr("fill", "red")
            .on("mouseover", function (event, d) {
                //const [xMouse, yMouse] = d3.pointer(event);
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
            
                tooltip.html(`School Level: ${d.schoolLevel}<br>Incidents: ${d.number}`)
                    //.style("left", `${xMouse + margin.left + centerWidth}px`)
                    //.style("top", `${yMouse + margin.top}px`);
                    .style("left", (event.clientX+10)+ "px")
                    .style("top", (event.clientY+window.scrollY)+ "px");
            })
            .on("mouseout", () => {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

        // ...

        schoolLevelChartContainer.append("g")
            .attr("transform", `translate(0,${h1})`)
            .call(d3.axisBottom(xSchoolLevel))
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("transform", "rotate(-45)");

        schoolLevelChartContainer.append("g")
            .call(d3.axisLeft(ySchoolLevel));

        schoolLevelChartContainer.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - h1 / 2)
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Total Number of Incidents");

        schoolLevelChartContainer.append("text")
            .attr("x", (w1 / 2))             
            .attr("y", 0 - (margin.top / 2))
            .attr("text-anchor", "middle")  
            .style("font-size", "24px") 
            .style("text-decoration", "underline")  
            .text("Incidents by School Type");
}

    function renderMonthsBarChart(data) {
        monthsChartContainer.selectAll("*").remove();
        let rangeSliderValues = getRangeSliderValues();

        // Filter the data based on the range slider values
        let selectedData = data.filter(d => d.Year >= rangeSliderValues[0] && d.Year <= rangeSliderValues[1]);

        // Your existing months bar chart rendering code
        const countsByMonth = Array.from(d3.group(selectedData, d => d.Month), ([month, values]) => ({
            month: month || 'Unknown',
            number: values.length
        }));
    
        countsByMonth.sort((a, b) => b.number - a.number);
    
        const xMonths = d3.scaleBand()
            .domain(countsByMonth.map(d => d.month))
            .range([0, w1 - centerWidth])
            .padding(0.1);
    
        const yMonths = d3.scaleLinear()
            .domain([0, d3.max(countsByMonth, d => d.number)])
            .range([h1, 0]);
    
        monthsChartContainer.selectAll(".bar")
            .data(countsByMonth)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", d => xMonths(d.month))
            .attr("width", xMonths.bandwidth())
            .attr("y", d => yMonths(d.number))
            .attr("height", d => h1 - yMonths(d.number))
            .attr("fill", "purple")
            .on("mouseover", function (event, d) {
                //const [xMouse, yMouse] = d3.pointer(event);
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
            
                tooltip.html(`Month: ${d.month}<br>Incidents: ${d.number}`)
                    //.style("left", `${xMouse + margin.left + centerWidth}px`)
                    //.style("top", `${yMouse + margin.top}px`);
                    .style("left", (event.clientX+10)+ "px")
                    .style("top", (event.clientY+window.scrollY)+ "px");
            })
            .on("mouseout", () => {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

        // ...

        monthsChartContainer.append("g")
            .attr("transform", `translate(0,${h1})`)
            .call(d3.axisBottom(xMonths))
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("transform", "rotate(-45)");

        monthsChartContainer.append("g")
            .call(d3.axisLeft(yMonths));

        monthsChartContainer.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - h1 / 2)
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Total Number of Incidents");

        monthsChartContainer.append("text")
            .attr("x", (w1 / 2))             
            .attr("y", 0 - (margin.top / 2))
            .attr("text-anchor", "middle")  
            .style("font-size", "24px") 
            .style("text-decoration", "underline")  
            .text("Incidents by Month");
    }

    // Update 1
    function renderCitiesBarChart(data, stateName) {
        citiesChartContainer.selectAll("*").remove();
        let rangeSliderValues = getRangeSliderValues();

        // Filter the data based on the range slider values
        let selectedData = data.filter(d => d.Year >= rangeSliderValues[0] && d.Year <= rangeSliderValues[1]);

        // Your existing cities bar chart rendering code
        const countsByCity = Array.from(d3.group(selectedData, d => d.City), ([city, values]) => ({
            city: city || 'Unknown',
            number: values.length
        }));
    
        countsByCity.sort((a, b) => b.number - a.number);
    
        const top5Cities = countsByCity.slice(0, 5);
    
        const xCities = d3.scaleBand()
            .domain(top5Cities.map(d => d.city))
            .range([0, w1 - centerWidth])
            .padding(0.1);
    
        const yCities = d3.scaleLinear()
            .domain([0, d3.max(top5Cities, d => d.number)])
            .range([h1, 0]);
    
        citiesChartContainer.selectAll(".bar")
            .data(top5Cities)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", d => xCities(d.city))
            .attr("width", xCities.bandwidth())
            .attr("y", d => yCities(d.number))
            .attr("height", d => h1 - yCities(d.number))
            .attr("fill", "#5233FF")  // Choose a color for cities bars
            .on("mouseover", function (event, d) {
                // ... (tooltip logic for cities)
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);

                tooltip.html(`State: ${d.city}<br>Incidents: ${d.number}`)
                    //.style("left", `${xMouse + margin.left + centerWidth}px`)
                    //.style("top", `${yMouse + margin.top}px`);
                    .style("left", (event.clientX+10+centerWidth)+ "px")
                    .style("top", (event.clientY+window.scrollY)+ "px");
            })
            .on("mouseout", () => {
                // ... (tooltip logic for cities)
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);

            })
            citiesChartContainer.append("g")
                .attr("transform", `translate(0,${h1})`)
                .call(d3.axisBottom(xCities))
                .selectAll("text")
                .style("text-anchor", "end")
                .attr("transform", "rotate(-45)");

            citiesChartContainer.append("g")
                .call(d3.axisLeft(yCities));

            citiesChartContainer.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - margin.left)
                .attr("x", 0 - h1 / 2)
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .text("Total Number of Incidents by City");

            citiesChartContainer.append("text")
                .attr("x", (w1 / 2))             
                .attr("y", 0 - (margin.top / 2))
                .attr("text-anchor", "middle")  
                .style("font-size", "24px") 
                .style("text-decoration", "underline")  
                .text("Incidents in " + stateName);

    }
            
/*function renderSchoolsStackedBarChart(schoolsData) {
    stackedBarChartContainer.selectAll("*").remove();

    // Add a container for the stacked bar chart
    /*const stackedBarChartContainer = schoolLevelChartContainer
        //.attr("id", "stackedBarChartContainer")
        .attr("width", w1 + margin.left + margin.right) // Update S2
        .attr("height", h1 + margin.top + margin.bottom) // Update S2
        .attr("transform", `translate(${w1 + margin.left + margin.right + centerWidth}, ${margin.top})`)
        .append("g");


    // Extract unique school names
    const uniqueSchools = Array.from(new Set(schoolsData.flat()));

    // Prepare data for the stacked bar chart
    const stackedData = uniqueSchools.map(school => {
        return {
            school: school,
            incidents: schoolsData.filter(s => s === school).length
        };
    });

    // Sort the stacked data by incidents in descending order
    stackedData.sort((a, b) => b.incidents - a.incidents);

    const xStacked = d3.scaleBand()
        .domain(stackedData.map(d => d.school))
        .range([0, w1])
        .padding(0.1);

    const yStacked = d3.scaleLinear()
        .domain([0, d3.max(stackedData, d => d.incidents)])
        .range([h1, 0]);

    // Add the stacked bars
    stackedBarChartContainer.selectAll(".stacked-bar")
        .data(stackedData)
        .enter().append("rect")
        .attr("class", "stacked-bar")
        .attr("x", d => xStacked(d.school))
        .attr("width", xStacked.bandwidth())
        .attr("y", d => yStacked(d.incidents))
        .attr("height", d => h1 - yStacked(d.incidents))
        .attr("fill", "blue")  // Choose a color for stacked bars
        .on("mouseover", function (event, d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);

            tooltip.html(`School: ${d.school}<br>Incidents: ${d.incidents}`)
                .style("left", (event.clientX + 10 + centerWidth) + "px")
                .style("top", (event.clientY + window.scrollY) + "px");
        })
        .on("mouseout", () => {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });

    // Add axes and labels for the stacked bar chart
    stackedBarChartContainer.append("g")
        .attr("transform", `translate(0,${h1})`)
        .call(d3.axisBottom(xStacked))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("transform", "rotate(-45)");

    stackedBarChartContainer.append("g")
        .call(d3.axisLeft(yStacked));

    stackedBarChartContainer.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - h1 / 2)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Total Number of Incidents by School");
}     */           
      
}).catch(error => console.log("Error loading data:", error));
