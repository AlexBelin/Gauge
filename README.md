# Gauge
Pack containing a JS file and an HTML example

1) Create the div you want place the gauge into => Ex: &lt;div id="gauge-circ-basic"&gt;&lt;/div&gt;
2) Create an instance => Ex: var gauge_circ_basic = new GaugeCirc(document.getElementById('gauge-circ-basic'), {'radius': 50, 'stroke': 20, 'StartAngle': 150, 'EndAngle': 390, 'color': 'green', 'speed': 1, 'displayValue': 'bold 14px arial'});
3) Launch the gauge with the Render method => Ex: gauge_circ_basic.Render();
4) Make the gauge draw the value compared to a max value => Ex: gauge_circ_basic.Refresh(400, 400);

The HTML contains :
1) a basic circular gauge with maximum display and specified start/end angles
2) some gauges linked to random values examples 
3) an interactive gauge example

![alt text](https://github.com/AlexBelin/CustomSelect/blob/main/screen02.jpg)
