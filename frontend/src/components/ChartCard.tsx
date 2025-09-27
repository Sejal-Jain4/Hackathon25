import React from 'react';
import { View, StyleSheet, Dimensions, ViewStyle, StyleProp } from 'react-native';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { Text } from './Text';
import { Card } from './Card';
import { useTheme } from '../services/theme-service';

const screenWidth = Dimensions.get('window').width - 40; // -40 for margins

interface ChartDataPoint {
  x: string;
  y: number;
}

interface ChartDataSet {
  data: ChartDataPoint[];
  color?: string;
  label?: string;
}

interface ChartCardProps {
  title: string;
  description?: string;
  type: 'line' | 'bar' | 'pie';
  datasets: ChartDataSet[];
  height?: number;
  width?: number;
  style?: StyleProp<ViewStyle>;
  yAxisSuffix?: string;
  yAxisPrefix?: string;
  formatYLabel?: (value: string) => string;
  formatXLabel?: (value: string) => string;
  decimalPlaces?: number;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  description,
  type,
  datasets,
  height = 220,
  width = screenWidth,
  style,
  yAxisSuffix = '',
  yAxisPrefix = '',
  formatYLabel,
  formatXLabel,
  decimalPlaces = 0,
}) => {
  const { theme, isDark } = useTheme();

  const chartConfig = {
    backgroundGradientFrom: theme.colors.surface,
    backgroundGradientTo: theme.colors.surface,
    decimalPlaces: decimalPlaces,
    color: (opacity = 1) => `rgba(91, 55, 183, ${opacity})`,
    labelColor: (opacity = 1) => theme.colors.text,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: theme.colors.primary,
    },
  };

  const renderChart = () => {
    if (type === 'line') {
      const data = {
        labels: datasets[0].data.map(point => point.x),
        datasets: datasets.map(dataset => ({
          data: dataset.data.map(point => point.y),
          color: (opacity = 1) => dataset.color || `rgba(91, 55, 183, ${opacity})`,
          strokeWidth: 2,
        })),
        legend: datasets.map(dataset => dataset.label || ''),
      };

      return (
        <LineChart
          data={data}
          width={width}
          height={height}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
          formatYLabel={formatYLabel}
          formatXLabel={formatXLabel}
          yAxisSuffix={yAxisSuffix}
          yAxisLabel={yAxisPrefix}
        />
      );
    }

    if (type === 'bar') {
      const data = {
        labels: datasets[0].data.map(point => point.x),
        datasets: datasets.map(dataset => ({
          data: dataset.data.map(point => point.y),
        })),
      };

      return (
        <BarChart
          data={data}
          width={width}
          height={height}
          chartConfig={chartConfig}
          style={styles.chart}
          fromZero
          showBarTops={false}
          formatYLabel={formatYLabel}
          yAxisSuffix={yAxisSuffix}
          yAxisLabel={yAxisPrefix}
        />
      );
    }

    if (type === 'pie') {
      const data = datasets[0].data.map((point, index) => {
        const dataset = datasets[0];
        return {
          name: point.x,
          value: point.y,
          color: dataset.color || `hsl(${(index * 60) % 360}, 70%, 60%)`,
          legendFontColor: theme.colors.text,
          legendFontSize: 12,
        };
      });

      return (
        <PieChart
          data={data}
          width={width}
          height={height}
          chartConfig={chartConfig}
          accessor="value"
          backgroundColor="transparent"
          paddingLeft="0"
          absolute
        />
      );
    }

    return null;
  };

  return (
    <Card style={[styles.container, style]}>
      <View style={styles.header}>
        <Text variant="h4">{title}</Text>
        {description && (
          <Text variant="body2" color={theme.colors.textSecondary} style={styles.description}>
            {description}
          </Text>
        )}
      </View>
      <View style={styles.chartContainer}>{renderChart()}</View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  header: {
    marginBottom: 16,
  },
  description: {
    marginTop: 4,
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  chart: {
    borderRadius: 16,
  },
});