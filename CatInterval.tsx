import React, { useEffect, useState } from 'react';
import moment from 'moment';
import * as echarts from 'echarts';

interface IProps {
  id?: string;
  data: {
    status: string;
    code: number;
    name: string;
    color: string;
    ms: number;
  }[];
  showSlider?: boolean;
  format?: 'H:mm' | 'H';
  theme?: 'dark' | 'white';
}

const CatInterval: React.FC<IProps> = ({
  data,
  showSlider = false,
  format = 'H',
  id,
  id2 = 'id2',
  theme = 'white',
}) => {
  const [myChart, setMyChart] = useState<echarts.ECharts>();
  const [myChart2, setMyChart2] = useState<echarts.ECharts>();

  // myChart?.on('dataZoom', e => {
  //   console.log(e);
  // });

  useEffect(() => {
    if (myChart && myChart2) {
      myChart.group = 'group1';
      myChart2.group = 'group2';
      echarts.connect([myChart, myChart2]);
    }
  }, [myChart, myChart2]);

  const categories = ['categoryA'];

  const renderItem = (params: any, api: any) => {
    var categoryIndex = api.value(0);
    var start = api.coord([api.value(1), categoryIndex]);
    var end = api.coord([api.value(2), categoryIndex]);
    var height = 50;

    var rectShape = echarts.graphic.clipRectByRect(
      {
        x: start[0],
        y: start[1] - height / 2,
        width: end[0] - start[0],
        height: height,
      },
      {
        x: params.coordSys.x,
        y: params.coordSys.y,
        width: params.coordSys.width,
        height: params.coordSys.height,
      }
    );

    return (
      rectShape && {
        type: 'rect',
        transition: ['shape'],
        shape: rectShape,
        style: api.style(),
      }
    );
  };

  const list: unknown[] = [];

  categories.forEach(function (category, index) {
    for (let i = 0; i < data.length - 1; i++) {
      const currentItem = data[i];
      const nextItem = data[i + 1];
      list.push({
        name: currentItem.name,
        value: [
          index,
          currentItem.ms,
          nextItem.ms,
          nextItem.ms - currentItem.ms,
        ],
        itemStyle: {
          normal: {
            color: currentItem.color,
          },
        },
      });
    }
  });
  const option = {
    // tooltip: {
    //   formatter: function (params: any) {
    //     return (
    //       params.marker +
    //       params.name +
    //       ": " +
    //       moment(params.value[1]).format("HH:mm:ss") +
    //       "~" +
    //       moment(params.value[2]).format("HH:mm:ss")
    //     );
    //   },
    //   backgroundColor: "rgba(0,0,0,0.5)",
    //   textStyle: {
    //     color: "#fff",
    //   },
    //   borderWidth: 0,
    // },
    // position: "top",
    // legend: {
    //   //图例
    //   data: ["故障", "自动"],
    //   // bottom: "1%",
    //   // selectedMode: false, // 图例设为不可点击
    //   textStyle: {
    //     color: "#000",
    //   },
    // },

    dataZoom: [
      {
        type: 'slider',
        show: showSlider,
        filterMode: 'weakFilter',
        showDataShadow: false,
        backgroundColor: '#2e345e', // 303864
        fillerColor: '#354378',
        bottom: '5%',
        left: '3%',
        right: '3%',
        height: 18,
        start: 2,
        end: 98,
        borderColor: '#354378',
        labelFormatter: '',
        selectedDataBackground: {
          lineStyle: {
            color: 'red',
          },
          areaStyle: {
            color: 'red',
          },
        },
        moveHandleSize: 0,
      },
      {
        type: 'inside',
        filterMode: 'weakFilter',
      },
    ],
    grid: {
      // height: 80,
      show: false,
      left: '3%',
      right: '3%',
      top: '25%',
      bottom: '40%',
    },
    xAxis: {
      scale: true,
      splitLine: {
        show: false,
      },
      axisLabel: {
        color: theme === 'white' ? '#fff' : '#000',
        formatter: function (val: number) {
          // console.log(val); // 1640760000000
          return moment(val).format(format);
        },
      },
    },
    yAxis: {
      show: true,
      data: ['categoryB', 'categoryA'],
    },
    series: [
      {
        type: 'custom',
        renderItem: renderItem,
        itemStyle: {
          opacity: 0.8,
        },
        encode: {
          x: [1, 2],
          y: 0,
        },
        data: list,
      },
      // {
      //   type: 'line',
      //   smooth: true,
      //   renderItem: (params) => {
      //     console.log(params);
      //   },
      //   data: [1320, 1132, 601, 234, 120, 90, 20]
      // },
      // {
      //   type: "custom",
      //   renderItem: (params) => {
      //     console.log(params);
      //   },
      //   // renderItem: renderItem,
      //   itemStyle: {
      //     opacity: 0.8,
      //   },
      //   encode: {
      //     x: [1, 2],
      //     y: 0,
      //   },
      //   data: list,
      // },
    ],
  };

  const onResize = () => {
    myChart && myChart.resize();
    myChart2 && myChart2.resize();
  };

  useEffect(() => {
    if (!myChart && id) {
      const chart = echarts.init(document.getElementById(id) as HTMLElement);
      setMyChart(chart);
    }
    myChart && myChart.setOption(option);
    if (!myChart2 && id2) {
      const chart2 = echarts.init(document.getElementById(id2) as HTMLElement);
      setMyChart2(chart2);
    }
    myChart2 && myChart2.setOption(option);
  });

  useEffect(() => {
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  });

  return (
    <div style={{ height: '100%', background: `#666` }}>
      <div id={id} style={{ height: '50%' }}></div>
      <div id={id2} style={{ height: '50%' }}></div>
    </div>
  );
};

export default CatInterval;
