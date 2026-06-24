import { useState, useEffect } from "react";
import { supabase } from "../utils/supabase";

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    highPriority: 0,
  });

  useEffect(() => {
    fetchTasks();

    // Real-time subscription
    const subscription = supabase
      .channel("slack_tasks_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "slack_tasks" },
        (payload) => {
          console.log("Real-time update:", payload);
          fetchTasks();
        },
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function fetchTasks() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("slack_tasks")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setTasks(data || []);

      // Calculate stats
      const total = data?.length || 0;
      const pending = data?.filter((t) => t.status === "pending").length || 0;
      const completed =
        data?.filter((t) => t.status === "completed").length || 0;
      const highPriority =
        data?.filter((t) => t.priority === "high").length || 0;

      setStats({ total, pending, completed, highPriority });
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  }

  async function updateTaskStatus(taskId, newStatus) {
    try {
      const { error } = await supabase
        .from("slack_tasks")
        .update({ status: newStatus })
        .eq("id", taskId);

      if (error) throw error;
    } catch (error) {
      console.error("Error updating task:", error);
    }
  }

  return { tasks, loading, stats, updateTaskStatus, refresh: fetchTasks };
}
