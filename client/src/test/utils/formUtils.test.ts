import { expect, it, describe } from "vitest";
import { frequencyIntervalSwitcher } from "../../utils/formUtils";

const dailyInterval = "10";
const weeklyInterval = "4";
const monthlyInterval = "24";
const annualInterval = "300";

const startDate = "2023-10-31";
const weeklyStartDate = "2023-11-01";
const monthlyStartDate = "2023-10-31";
const annualStartDate = "2023-10-31";

const completionDate = "2023-11-31";
const weeklyCompletionDate = "2023-12-22";
const monthlyCompletionDate = "2023-12-31";
const annualCompletionDate = "2024-10-31";

const createdService = {
  intervals: { dailyInterval, weeklyInterval, monthlyInterval, annualInterval },
  startDates: { startDate, weeklyStartDate, monthlyStartDate, annualStartDate },
  completionDates: {
    completionDate,
    weeklyCompletionDate,
    monthlyCompletionDate,
    annualCompletionDate,
  },
};
describe("frequencyIntervalSwitcher function", () => {
  it("correctly formats a ONCE service", () => {
    const result = frequencyIntervalSwitcher({
      ...createdService,
      frequency: "ONCE",
    });
    expect(result.interval).toEqual(10);
    expect(result.formattedStartDate).toEqual("2023-10-31T00:00:00.000Z");
    expect(result.formattedCompletionDate).toEqual("2023-10-31T00:00:00.000Z");
  });
  it("correctly creates a DAILY service", () => {
    const result = frequencyIntervalSwitcher({
      ...createdService,
      frequency: "DAILY",
    });
    expect(result.interval).toEqual(10);
    expect(result.formattedStartDate).toEqual("2023-10-31T00:00:00.000Z");
    expect(result.formattedCompletionDate).toEqual("2023-12-01T00:00:00.000Z");
  });
  it("correctly creates a WEEKLY service", () => {
    const result = frequencyIntervalSwitcher({
      ...createdService,
      frequency: "WEEKLY",
    });
    expect(result.interval).toEqual(4);
    expect(result.formattedStartDate).toEqual("2023-11-01T00:00:00.000Z");
    expect(result.formattedCompletionDate).toEqual("2023-12-22T00:00:00.000Z");
  });
  it("correctly creates a MONTHLY service", () => {
    const result = frequencyIntervalSwitcher({
      ...createdService,
      frequency: "MONTHLY",
    });
    expect(result.interval).toEqual(24);
    expect(result.formattedStartDate).toEqual("2023-10-31T00:00:00.000Z");
    expect(result.formattedCompletionDate).toEqual("2023-12-31T00:00:00.000Z");
  });
  it("correctly creates an ANNUAL service", () => {
    const result = frequencyIntervalSwitcher({
      ...createdService,
      frequency: "ANNUALLY",
    });
    expect(result.interval).toEqual(300);
    expect(result.formattedStartDate).toEqual("2023-10-31T00:00:00.000Z");
    expect(result.formattedCompletionDate).toEqual("2024-10-31T00:00:00.000Z");
  });
});
