import React, { useEffect, useState, createRef } from "react";
import Chart from "chart.js";
import LegendWidget from "./Legend";
import { get } from "../../../../utils/api";

const MyConfigurations = ({ componentProp }) => {
  const { label, endpoint, orderLabels, daysLabel } = JSON.parse(componentProp);
  const domRef1 = createRef();
  const domRef2 = createRef();
  const domRef3 = createRef();
  const [summary, setSummary] = useState(false);
  const [error, setError] = useState(false);
  const refs = [domRef1, domRef2, domRef3];

  const getColors = (i) => {
    const elem = document.querySelector(
      `.cmp-myconfigurations .cmp-dcp-widget-chart__sub-title-color-${i}`
    );
    const color = getComputedStyle(elem).borderRightColor;
    return [color, "#E6E6E6"];
  };
  const getTotal = () => {
    return Object.keys(summary).reduce((result, s) => {
      if (!isNaN(summary[s]) && summary[s]) result += summary[s];
      return result;
    }, 0);
  };
  const getSummaryValues = (key) => {
    const total = getTotal();
    const s = summary[key] ? summary[key] : 0;
    return [s, total - s];
  };
  const createChart = (node, i, key, chartLabel) => {
    return new Chart(node, {
      type: "doughnut",
      options: {
        legend: {
          display: false,
        },
        tooltips: {
          enabled: false,
        },
        cutoutPercentage: 60,
      },
      data: {
        labels: [chartLabel, ""],
        datasets: [
          {
            label: "",
            data: getSummaryValues(key),
            backgroundColor: getColors(i),
          },
        ],
      },
    });
  };

  const getFontSize = (textLength) => {
    const baseSize = 6;
    if (textLength >= baseSize || textLength ===5) {
        textLength = baseSize - 1.5;
    }
    const fontSize = baseSize - textLength;
    return `${fontSize}vh`;
  };
  
  const donuts = document.querySelectorAll('.cmp-responsive-font span');
    
  donuts.forEach(donut => {
    donut.style.fontSize = getFontSize(donut.textContent.length);
  });


  useEffect(() => {
    if (summary) {
      createChart(domRef1.current.getContext("2d"), 1, "unQuoted", "Unquoted");
      createChart(domRef2.current.getContext("2d"), 2, "quoted", "Quoted");
      createChart(
        domRef3.current.getContext("2d"),
        3,
        "oldConfigurations",
        "Inactive"
      );
    }
  }, [summary]);
  useEffect(async () => {
    try {
      const { data } = await get(endpoint);
      if (data) {
        setSummary(data.content.summary);
        setError(false);
      } else {
        setError(true);
      }
    } catch (e) {
      setError(true);
    }
  }, []);
  return (
    <div className="cmp-dcp-widget cmp-myconfigurations">
      {summary ? (
        <div className="cmp-dcp-widget-chart__container">
            <h5 className="cmp-dcp-widget-chart__title">
            {label}
            <span>{daysLabel}</span>
            </h5>
          <div className="cmp-dcp-widget-chart__body">
            <div className="cmp-dcp-widget-chart__legend">
              <LegendWidget items={orderLabels} />
            </div>
            <div className="cmp-dcp-widget-chart__chart-row">
              {orderLabels.map((item, i) => (
                <div className="cmp-dcp-widget-chart__chart cmp-dcp-widget-chart__donut-chart cmp-responsive-font">
                  <canvas width="125" height="100" ref={refs[i]} />
                  <span>{summary[item.key]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : error ? (
        <p> Error </p>
      ) : (
        <p>  <div class="cmp-spinner"><div class="cmp-loading">Loading…</div></div>  </p>
      )}
    </div>
  );
};

export default MyConfigurations;
