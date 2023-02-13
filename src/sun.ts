import { environment, LaunchType, showToast, Toast, updateCommandMetadata } from "@raycast/api";
import fs from "fs/promises";

export default async function command() {
  const today = new Date();
  const todayDate = today.getUTCDate();
  const currentDay = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][today.getUTCDay()];
  const currentMonth = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][
    today.getUTCMonth()
  ];

  let sunrise = "";
  let sunset = "";

  try {
    const sunData = await JSON.parse(await fs.readFile(`${environment.assetsPath}/Sun.json`, "utf-8"));

    const sunDataToday = sunData.find(
      (data: { Day: string; Date: number; Mon: string }) =>
        data.Day === currentDay && data.Date === todayDate && data.Mon === currentMonth
    );

    if (!sunDataToday) {
      sunrise = sunset = "Data not found";
      return;
    }

    sunrise = sunDataToday.Sunrise;
    sunset = sunDataToday.Sunset;
  } catch (error) {
    console.error(error);
  }

  updateCommandMetadata({
    subtitle: `Sunrise: ${sunrise} | Sunset: ${sunset} | ${currentDay} ${todayDate} ${currentMonth}`,
  });

  if (environment.launchType === LaunchType.UserInitiated) {
    await showToast({
      style: Toast.Style.Success,
      title: "Refreshed progress",
      message: `Sunrise: ${sunrise} | Sunset: ${sunset}`,
    });
  }
}
