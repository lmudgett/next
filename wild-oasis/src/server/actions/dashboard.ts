"use server";
import * as dashboardUC from "@/server/services/dashboard";
import type { DashboardData } from "@/server/services/dashboard";

export const getDashboardDataAction = async (
  numDays: number
): Promise<{ success: boolean; data?: DashboardData; message?: string }> => {
  try {
    const data = await dashboardUC.getDashboardData(numDays);
    return { success: true, data };
  } catch (error) {
    return { success: false, message: `Unable to load dashboard data ${error}` };
  }
};
