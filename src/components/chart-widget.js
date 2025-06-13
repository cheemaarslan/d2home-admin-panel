import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Card } from 'antd';
import ApexChart from 'react-apexcharts';
import {
  apexAreaChartDefaultOption,
  apexBarChartDefaultOption,
  apexLineChartDefaultOption,
  apexPieChartDefaultOption,
} from '../constants/ChartConstant';

const DIR_RTL = 'rtl';

const titleStyle = {
  position: 'absolute',
  zIndex: '1',
};

const extraStyle = {
  position: 'absolute',
  zIndex: '1',
  right: '0',
  top: '-2px',
};

const getChartTypeDefaultOption = (type) => {
  switch (type) {
    case 'line':
      return apexLineChartDefaultOption;
    case 'bar':
      return apexBarChartDefaultOption;
    case 'area':
      return apexAreaChartDefaultOption;
    case 'pie':
      return apexPieChartDefaultOption;
    default:
      return apexLineChartDefaultOption;
  }
};

const ChartWidget = ({
  title,
  series,
  width,
  height,
  xAxis,
  customOptions,
  card,
  type,
  extra,
  direction,
  bodyClass,
}) => {
  const chartRef = useRef(null);
  const extraRef = useRef(null);
  const isMobile = window.innerWidth < 768;

  const setLegendOffset = () => {
    if (chartRef.current) {
      const legend = chartRef.current.querySelector('.apexcharts-legend');
      if (legend) {
        legend.style.marginRight = `${isMobile ? 0 : extraRef.current?.offsetWidth || 0}px`;
        if (direction === DIR_RTL) {
          legend.style.right = 'auto';
          legend.style.left = '0';
        }
        if (isMobile) {
          legend.style.position = 'relative';
          legend.style.top = '0';
          legend.style.justifyContent = 'start';
          legend.style.padding = '0';
        }
      }
    }
  };

  useEffect(() => {
    setLegendOffset();

    // Set up ResizeObserver to handle resizing
    const resizeObserver = new ResizeObserver(() => {
      setTimeout(() => {
        setLegendOffset();
      }, 600);
    });

    if (chartRef.current) {
      resizeObserver.observe(chartRef.current);
    }

    return () => {
      if (chartRef.current) {
        resizeObserver.unobserve(chartRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let options = JSON.parse(JSON.stringify(getChartTypeDefaultOption(type)));
  options.xaxis = {
    categories: xAxis,
  };
  if (customOptions) {
    options = { ...options, ...customOptions };
  }

  const renderChart = () => (
    <div
      style={direction === DIR_RTL ? { direction: 'ltr' } : {}}
      className="chartRef"
      ref={chartRef}
    >
      <ApexChart
        options={options}
        type={type}
        series={series}
        width={width}
        height={height}
      />
    </div>
  );

  return (
    <>
      {card ? (
        <Card>
          <div className={`position-relative ${bodyClass}`}>
            {title && (
              <h4
                className="font-weight-bold"
                style={!isMobile ? titleStyle : {}}
              >
                {title}
              </h4>
            )}
            {extra && (
              <div ref={extraRef} style={!isMobile ? extraStyle : {}}>
                {extra}
              </div>
            )}
            {renderChart()}
          </div>
        </Card>
      ) : (
        renderChart()
      )}
    </>
  );
};

ChartWidget.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  series: PropTypes.array.isRequired,
  xAxis: PropTypes.array,
  customOptions: PropTypes.object,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  card: PropTypes.bool,
  type: PropTypes.string,
  extra: PropTypes.element,
  bodyClass: PropTypes.string,
  direction: PropTypes.string,
};

ChartWidget.defaultProps = {
  series: [],
  height: 300,
  width: '100%',
  card: true,
  type: 'line',
};

export default ChartWidget;