import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  SafeAreaView,
} from "react-native";
import { useTasks } from "../hooks/useTasks";

const PriorityBadge = ({ priority }) => {
  const colors = {
    high: "#FF6B6B",
    medium: "#FFD93D",
    low: "#6BCB77",
  };

  return (
    <View
      style={[styles.badge, { backgroundColor: colors[priority] || "#ccc" }]}
    >
      <Text style={styles.badgeText}>{priority?.toUpperCase()}</Text>
    </View>
  );
};

const TaskCard = ({ task, onStatusChange }) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <Text style={styles.taskTitle}>{task.task}</Text>
      <PriorityBadge priority={task.priority} />
    </View>

    <Text style={styles.taskCategory}>📁 {task.category}</Text>
    <Text style={styles.taskDate}>
      📅 {new Date(task.created_at).toLocaleDateString()}
    </Text>

    {task.deadline && (
      <Text style={styles.deadline}>
        ⏰ Due: {new Date(task.deadline).toLocaleDateString()}
      </Text>
    )}

    <View style={styles.statusRow}>
      <Text
        style={[
          styles.statusText,
          task.status === "pending" ? styles.pending : styles.completed,
        ]}
      >
        {task.status === "pending" ? "⏳ Pending" : "✅ Completed"}
      </Text>

      <TouchableOpacity
        style={styles.actionButton}
        onPress={() =>
          onStatusChange(
            task.id,
            task.status === "pending" ? "completed" : "pending",
          )
        }
      >
        <Text style={styles.actionButtonText}>
          {task.status === "pending" ? "Complete" : "Reopen"}
        </Text>
      </TouchableOpacity>
    </View>
  </View>
);

export default function TaskListScreen() {
  const { tasks, loading, stats, updateTaskStatus, refresh } = useTasks();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📋 Tasks</Text>
        <View style={styles.statsRow}>
          <StatBadge label="Total" value={stats.total} color="#4A90D9" />
          <StatBadge label="Pending" value={stats.pending} color="#FFD93D" />
          <StatBadge label="Done" value={stats.completed} color="#6BCB77" />
        </View>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskCard task={item} onStatusChange={updateTaskStatus} />
        )}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refresh} />
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const StatBadge = ({ label, value, color }) => (
  <View style={[styles.statBadge, { backgroundColor: color + "20" }]}>
    <Text style={[styles.statValue, { color }]}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    backgroundColor: "#fff",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E9ECEF",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#212529",
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
  },
  statBadge: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 12,
    color: "#6C757D",
    marginTop: 4,
  },
  listContent: {
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#212529",
    flex: 1,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  taskCategory: {
    fontSize: 13,
    color: "#6C757D",
    marginBottom: 4,
  },
  taskDate: {
    fontSize: 12,
    color: "#ADB5BD",
    marginBottom: 4,
  },
  deadline: {
    fontSize: 12,
    color: "#FF6B6B",
    marginBottom: 12,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#E9ECEF",
    paddingTop: 12,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "500",
  },
  pending: {
    color: "#FFD93D",
  },
  completed: {
    color: "#6BCB77",
  },
  actionButton: {
    backgroundColor: "#4A90D9",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
});
