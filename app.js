const URL = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json";

const margin = {top: 20, right: 20, bottom: 40, left: 50};
const width = 1250 - margin.left - margin.right;
const height = 575 - margin.top - margin.bottom;

const months = {1:"Jan", 2:"Feb", 3:"Mar",4:"Apr", 5:"May", 6:"Jun",
            7:"Jul", 8:"Aug", 9:"Sep",10:"Oct", 11:"Nov", 12:"Dec"};


d3.json(URL).get((error,data)=>{
  if (error) console.log(error);

  const baseTemp = data.baseTemperature;

  const colorDomain = d3.extent(data.monthlyVariance, function(d){
    return d.variance;
  });

  const colorScale = d3.scaleLinear()
    .domain(colorDomain)
    .range(["#FEFEFA","#A52A2A"]);

  const x = d3.scaleLinear()
                .domain(d3.extent(data.monthlyVariance, d => d.year ))
                .range([0, width]);

  const y = d3.scaleLinear()
                .domain(d3.extent(data.monthlyVariance, d => d.month ))
                .range([20, height-40]);

  const yAxis = d3.axisLeft(y).tickFormat(d => months[d]);
  const xAxis = d3.axisBottom(x);

  const svg = d3.select(".chart")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height+ margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


  const chartGroup = svg.append("g");

  chartGroup.selectAll("rect")
    .data(data.monthlyVariance)
    .enter()
    .append("rect")
      .attr("x", d=> x(d.year))
      .attr("y", d=> y(d.month))
      .attr("width", 5)
      .attr("height", 39)
      .style("fill", d=> colorScale(d.variance))
        .on("mouseover", () => {
          tooltip.style("visibility", "visible");
          })
        .on("mouseout", () => {
          tooltip.style("visibility", "hidden");
        })
        .on("mousemove", (d) => {
          tooltip.select("text").text(`${months[d.month]}
            ${d.year}, Temp: ${(d.variance + baseTemp).toFixed(2)} °C
            (${d.variance.toFixed(2)})`);
        });


  let tooltip = chartGroup.append("g").attr("class","tooltip").style("visibility", "hidden");
  tooltip.append("text").attr("x","3").attr("y","10").style("font-size","16px").attr("font-weight","bold");

  chartGroup.append("g").attr("transform","translate(-5,20)").call(yAxis);
  chartGroup.append("g").attr("transform","translate(0,"+height+")").call(xAxis);

});
