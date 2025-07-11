export const getLevelfromAttendanceDate = (attendanceDate: string) => {
  if (!attendanceDate) return "none";
  const date = new Date(attendanceDate);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays > 30) return "none";
  if (diffDays > 15) return "low";
  if (diffDays > 7) return "medium";
  return "high";
};
