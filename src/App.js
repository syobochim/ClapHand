import React, { useState, useEffect } from 'react';
import './App.css';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);

function App() {
  const [data, setData] = useState({ emoji: "👏", event: "", owner: "" })
  const [showResult, setShowResult] = useState(false)
  const [am4chart, setAm4Chart] = useState({})
  const eventId = new URL(window.location).searchParams.get("id")

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`https://kogh98ozya.execute-api.ap-northeast-1.amazonaws.com/production/clap?id=${encodeURIComponent(eventId)}`)
      if (!response.ok) {
        console.error(response);
      } else {
        const resJson = await response.json()
        console.log(resJson)
        setData({ emoji: resJson.emoji, event: resJson.event, owner: resJson.owner })
      }
    };
    fetchData();
  }, [])

  const clickHandler = async () => {
    const response = await fetch(`https://kogh98ozya.execute-api.ap-northeast-1.amazonaws.com/production/clap?id=${encodeURIComponent(eventId)}`, {
      method: 'PUT'
    })
    if (!response.ok) {
      console.error(response);
    } else {
      const resJson = await response.json()
      console.log('clap! : ' + resJson)
    }
  };

  async function createChart() {
    const chart = am4core.create("chartdiv", am4charts.XYChart);
    const response = await fetch(`https://rut02jnice.execute-api.ap-northeast-1.amazonaws.com/production/event?eventName=${encodeURIComponent(data.event)}`)
    if (!response.ok) {
      console.error(response);
      return
    }
    const resJson = await response.json()
    chart.data = resJson.data.listClapsSortedByEvent.items.map(data => {
      return Object.assign(data, {
        color: chart.colors.next(),
      })
    })

    // Create axes
    var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "owner";
    categoryAxis.renderer.grid.template.disabled = true;
    categoryAxis.renderer.minGridDistance = 30;
    categoryAxis.renderer.inside = true;
    categoryAxis.renderer.labels.template.fill = am4core.color("#fff");
    categoryAxis.renderer.labels.template.fontSize = 20;

    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.grid.template.strokeDasharray = "4,4";
    valueAxis.renderer.labels.template.disabled = true;
    valueAxis.min = 0;

    // Do not crop bullets
    chart.maskBullets = false;

    // Create series
    var series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = "count";
    series.dataFields.categoryX = "owner";
    series.columns.template.propertyFields.fill = "color";
    series.columns.template.propertyFields.stroke = "color";
    series.columns.template.column.cornerRadiusTopLeft = 15;
    series.columns.template.column.cornerRadiusTopRight = 15;
    series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/b]";

    var bullet = series.bullets.push(new am4charts.LabelBullet());
    bullet.label.text = "{emoji}";
    setAm4Chart(chart)
  }

  const eventHandler = () => {
    let showFlag = !showResult  // setShowResultした直後にshowResultは変わらないので、一時的に変数に代入する
    setShowResult(showFlag)
    if (showFlag) {
      createChart()
    }
  }

  const reloadHander = () => {
    createChart()
  }

  return (
    <div className="App">
      <div id="chartdiv" style={{ display: showResult ? 'block' : 'none' }}></div>
      {showResult ?
        (<div className="eventPage">
          <button className="ReloadButton" onClick={reloadHander}>Reload</button>
          <button className="eventPageButton" onClick={eventHandler}>Clap</button>
        </div>
        ) : (
          <div>
            <p className="eventName">
              {data.event}
            </p>
            <p className="eventOwner">
              {data.owner}
            </p>
            <p>
              {eventId}
            </p>
            <p id="emoji" onClick={clickHandler}>
              {data.emoji}
            </p>
            <div className="eventPage">
              <button className="eventPageButton" onClick={eventHandler}>Result</button>
            </div>
          </div>
        )
      }
    </div>
  );
}

export default App;
