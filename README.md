# [Balllon Tracking]()
Small application I made in three days, that visualizes weather balloons from https://windbornesystems.com, in addition to ongoing weather events such as cyclones, and volcanoes. Clicking on weather 
ballon allows the user to observe the forecast at that location, to better understand how the weather balloons are affected by the climate. All of the data, comes from a continously updated data source 
from the last 24 hours. Mapbox and [deck.gl](deck.gl) are the main libraries/APIs powering the visuals. 

## Features
- Toggle visibililty of ballons and weather events
- Get balloons data, at hourly interval which can be changed in real-time with a slider
- Click on a balloon to get the forecast at that exact location at the exact time specified by the aforementioned "hours_ago" slider
- Click on a balloon to get the nearest weather event (cylcones, and volcanoes)

# Credits
- Credit to the [Open Meteo API](https://open-meteo.com) for providing a free, quality forecast API
- Credit to [Mapbox](https://www.mapbox.com/) for a high-quality basemap
- Credit to [deck.gl](deck.gl) for a great visualization library
- Credit to [Wind Born Systems](https://windbornesystems.com) for a extensive, and interesting weather balloon API
