import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { LineChart, PieChart } from "react-native-chart-kit";
import { useTasks } from "../hooks/useTasks";

const screenWidth = Dimensions.get("window").width - 40;

export default function AnalyticsScreen() {
  const { tasks, stats } = useTasks();

  // Calculate category distribution
  const categoryData = tasks.reduce((acc, task) => {
    acc[task.category] = (acc[task.category] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.entries(categoryData).map(
    ([category, count], index) => ({
      name: category,
      population: count,
      color: ["#FF6B6B", "#4A90D9", "#FFD93D", "#6BCB77", "#9B59B6"][index % 5],
      legendFontColor: "#7F7F7F",
      legendFontSize: 12,
    }),
  );

  // Weekly task creation data (mock for demo)
  const lineData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        data: [3, 5, 2, 8, 4, 1, 2],
        color: () => "#4A90D9",
        strokeWidth: 2,
      },
    ],
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>📊 Analytics</Text>
        </View>

        <View style={styles.statsGrid}>
          <StatCard
            title="Total Tasks"
            value={stats.total}
            icon="📋"
            color="#4A90D9"
          />
          <StatCard
            title="Pending"
            value={stats.pending}
            icon="⏳"
            color="#FFD93D"
          />
          <StatCard
            title="Completed"
            value={stats.completed}
            icon="✅"
            color="#6BCB77"
          />
          <StatCard
            title="High Priority"
            value={stats.highPriority}
            icon="🔥"
            color="#FF6B6B"
          />
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Tasks by Category</Text>
          {pieData.length > 0 ? (
            <PieChart
              data={pieData}
              width={screenWidth}
              height={200}
              chartConfig={{
                color: () => "#4A90D9",
              }}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
            />
          ) : (
            <Text style={styles.noData}>No data yet</Text>
          )}
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Weekly Activity</Text>
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Weekly Activity</Text>
            <Text style={styles.noData}>Coming soon</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const StatCard = ({ title, value, icon, color }) => (
  <View
    style={[styles.statCard, { borderLeftColor: color, borderLeftWidth: 4 }]}
  >
    <Text style={styles.statIcon}>{icon}</Text>
    <Text style={[styles.statValue, { color }]}>{value}</Text>
    <Text style={styles.statTitle}>{title}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    padding: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#212529",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 16,
    gap: 12,
  },
  statCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    width: "47%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 28,
    fontWeight: "bold",
  },
  statTitle: {
    fontSize: 12,
    color: "#6C757D",
    marginTop: 4,
  },
  chartCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    margin: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#212529",
    marginBottom: 16,
  },
  lineChart: {
    borderRadius: 16,
  },
  noData: {
    textAlign: "center",
    color: "#6C757D",
    padding: 40,
  },
});
