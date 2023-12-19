# Project Progress Report

Unmasking the Epidemic: Analyzing the Complex
Factors Behind Gun Violence in the United States

Tanay Kumar Sayala, Ravi Varma Pakalapati, Ben George Samuel

## Overview:
The goal of our project is to explore and understand the complex factors contributing to gun violence in the United States. We are utilizing data from diverse sources, including the US Census and the K-12 School Shooting Database, to uncover patterns related to geographic distribution, mental health, political affiliations, socioeconomic status, racial demographics, and more.

## Visualizations:
### 1. Frequency and Distribution of School Shootings
Description:
•	This visualization depicts the frequency and distribution of school shootings across the United States.
Features of the Data:
•	Data sourced from the K-12 School Shooting Database.
•	Each state is represented as a shape on the map, with color intensity indicating the frequency of incidents.
Attributes (Marks and Channels):
•	Marks: Geographical shapes (polygons) for each state.
•	Channels: Color intensity represents the frequency of school shootings.


### 2. Incidents Per Year with Highlight on Most Incidents
Description:
•	This visualization presents the distribution of school shooting incidents over the years, with a specific focus on highlighting the school with the most incidents in each year.
Features of the Data:
•	Time-series data extracted from the K-12 School Shooting Database, including the number of incidents per year.
•	School-level details, including names and incident counts.
Attributes (Marks and Channels):
•	Marks: Stacked bars for each year, segmented to represent different schools.
•	Channels: Different colors indicate various schools within each year; bar height represents the total incidents.
Highlighting the School with Most Incidents:
•	An additional visual cue, such as a contrasting color or label, will be applied to the segment corresponding to the school with the highest incident count in each year.This visualization aims to provide a year-by-year overview of school shooting incidents, emphasizing the school that experienced the most incidents in each respective year.

### 3. Access to Mental Health Support
Description:
•	This visualization explores the availability of mental health support services at the state and county levels.
Features of the Data:
•	Data sourced from state and county health agencies.
•	Mental health support levels are categorized.
Attributes (Marks and Channels):
•	Marks: Vertical bars for each state or county.
•	Channels: Bar height represents the level of access; color intensity indicates severity.


### 4. Political Affiliations and Ideologies
Description:
•	Investigating the political affiliations and ideologies prevalent in areas with high rates of school shootings.
Features of the Data:
•	Political affiliation data obtained from public records and surveys.
Attributes (Marks and Channels):
•	Marks: Bar chart segments representing different political affiliations.
•	Channels: Color indicates the percentage of each political affiliation.

### 5. Income Distribution Across Regions
Description:
•	Visualizing income distribution across regions and exploring its link to school shootings.
Features of the Data:
•	Income distribution data from the US Census.
Attributes (Marks and Channels):
•	Marks: Choropleth map or bar chart segments for each region.
•	Channels: Color intensity or bar height represents income levels.

### 6. Racial Demographics of Areas with High Incidence
Description:
•	Analyzing the racial demographics of areas with a high incidence of school shootings.
Features of the Data:
•	Racial demographics data obtained from census and demographic surveys.
Attributes (Marks and Channels):
•	Marks: Stacked bar chart segments representing different racial demographics.
•	Channels: Color intensity indicates the percentage of each racial group.

## Interaction and Exploration Features:

### 1.	Overview First:

•	Description:
The "Overview First" approach is evident in the initial map visualization that provides a high-level summary of school shooting incidents across the United States. The color-coded intensity on the map allows users to quickly identify regions with higher frequencies, providing an immediate understanding of the geographic distribution.
•	Implementation:
A choropleth map displaying states with varying color intensity based on the frequency of school shootings. Users can easily identify hotspots and trends at a glance, guiding them to regions requiring closer examination.

### 2. Zoom and Filter:
•	Description:
Users have the ability to zoom in on specific states or regions for a more detailed view. Additionally, a filter mechanism allows users to focus on incidents within a selected time range, aiding in the exploration of temporal patterns.
•	Implementation:
The interactive map supports zoom functionalities, enabling users to zoom in for a closer look at individual states. A time slider or dropdown menu facilitates the filtering of incidents based on specific years, promoting a more granular analysis of temporal trends.
### 3. Detail on Demand:
•	Description:
Detail-on-demand is implemented through interactive tooltips on the map. When users hover over a state, additional information such as the exact number of incidents, state name, and any specific characteristics are dynamically displayed.
•	Implementation:
Users can hover over a state on the map to reveal a tooltip containing detailed information, enhancing the user's understanding of the context. This allows users to gather specific insights without overwhelming the initial view with excessive details.

## Next Steps:
Our project has made significant progress in visualizing and analyzing the multifaceted aspects of gun violence. The next steps involve deeper analysis, refinement of visualizations, and the synthesis of findings to propose evidence-based policy recommendations.


