import { expect, it, describe } from "vitest";
import { subDays, addDays } from "date-fns";
import { IServiceEventException } from "../../types";
import {
  createDateItem,
  previousCalendarOverlap,
  nextMonthsDateCalendarOverlap,
  createEmptyDateItems,
  withinRange,
  getWeeklyStartDate,
  getMonthlyStartDate,
  getAnnuallyStartDate,
  filterEventsByRange,
  createEvent,
} from "../../utils/calendarUtils"; // Import the functions from your code file

const baseEvents: IServiceEventException[] = [
  {
    _id: "1",

    service: {
      _id: "service1",
      name: "Service 1",
      created_by: {
        _id: "user1",
        first_name: "John",
        last_name: "Doe",
        email: "john@example.com",
        auth: "USER",
        __v: 0,
        createdAt: "2023-10-01T00:00:00.000Z",
        updatedAt: "2023-10-01T00:00:00.000Z",
      },
      resource: {
        _id: "resource1",
        name: "Resource 1",
        location: {
          _id: "location1",
          name: "Location 1",
          numResources: 3,
          __v: 0,
          createdAt: "2023-10-01T00:00:00.000Z",
          updatedAt: "2023-10-01T00:00:00.000Z",
        },
        created_by: {
          _id: "user1",
          first_name: "John",
          last_name: "Doe",
          email: "john@example.com",
          auth: "USER",
          __v: 0,
          createdAt: "2023-10-01T00:00:00.000Z",
          updatedAt: "2023-10-01T00:00:00.000Z",
        },
        notes: "Resource 1 notes",
        numServices: 2,
        __v: 0,
        createdAt: "2023-10-01T00:00:00.000Z",
        updatedAt: "2023-10-01T00:00:00.000Z",
      },
      start_date: "2023-10-15T00:00:00.000Z",
      completion_date: "2023-10-15T00:00:00.000Z",
      interval: 1,
      frequency: "ONCE",
      __v: 0,
      createdAt: "2023-10-01T00:00:00.000Z",
      updatedAt: "2023-10-01T00:00:00.000Z",
    },
    exception_date: "2023-10-16T00:00:00.000Z",
    is_cancelled: false,
    is_rescheduled: false,
    start_date: "2023-10-15T00:00:00.000Z",
    created_by: {
      _id: "user2",
      first_name: "Jane",
      last_name: "Smith",
      email: "jane@example.com",
      auth: "ADMIN",
      __v: 0,
      createdAt: "2023-10-01T00:00:00.000Z",
      updatedAt: "2023-10-01T00:00:00.000Z",
    },
    __v: 0,
    createdAt: "2023-10-01T00:00:00.000Z",
    updatedAt: "2023-10-01T00:00:00.000Z",
  },

  {
    _id: "2",
    service: {
      _id: "service2",
      created_by: {
        _id: "user3",
        first_name: "Mike",
        last_name: "Johnson",
        email: "mike@example.com",
        auth: "ENHANCED",
        __v: 0,
        createdAt: "2023-10-01T00:00:00.000Z",
        updatedAt: "2023-10-01T00:00:00.000Z",
      },
      name: "Service 2",
      resource: {
        _id: "resource2",
        name: "Resource 2",
        location: {
          _id: "location2",
          name: "Location 2",
          numResources: 2,
          __v: 0,
          createdAt: "2023-10-01T00:00:00.000Z",
          updatedAt: "2023-10-01T00:00:00.000Z",
        },
        created_by: {
          _id: "user3",
          first_name: "Mike",
          last_name: "Johnson",
          email: "mike@example.com",
          auth: "ENHANCED",
          __v: 0,
          createdAt: "2023-10-01T00:00:00.000Z",
          updatedAt: "2023-10-01T00:00:00.000Z",
        },
        numServices: 3,
        __v: 0,
        createdAt: "2023-10-01T00:00:00.000Z",
        updatedAt: "2023-10-01T00:00:00.000Z",
      },
      start_date: "2023-10-20T00:00:00.000Z",
      completion_date: "2023-10-20T00:00:00.000Z",
      interval: 2,
      frequency: "WEEKLY",
      __v: 0,
      createdAt: "2023-10-01T00:00:00.000Z",
      updatedAt: "2023-10-01T00:00:00.000Z",
    },
    exception_date: "2023-10-21T00:00:00.000Z",
    is_cancelled: true,
    is_rescheduled: false,
    start_date: "2023-10-20T00:00:00.000Z",
    created_by: {
      _id: "user4",
      first_name: "Sarah",
      last_name: "Brown",
      email: "sarah@example.com",
      auth: "USER",
      __v: 0,
      createdAt: "2023-10-01T00:00:00.000Z",
      updatedAt: "2023-10-01T00:00:00.000Z",
    },
    __v: 0,
    createdAt: "2023-10-01T00:00:00.000Z",
    updatedAt: "2023-10-01T00:00:00.000Z",
  },

  // Add more test data objects as needed
];

describe("Date Utility Functions", () => {
  describe("createDateItem function", () => {
    it("creates a date item with no events if events parameter is not provided", () => {
      const date = new Date("2023-10-01");
      const dateItem = createDateItem(date);

      // Assert that the date property matches the input date
      expect(dateItem.date).toEqual(date);

      // Assert that the events property is an empty array
      expect(dateItem.events).toEqual([]);
    });

    it("creates a date item with events if events parameter is provided", () => {
      const date = new Date("2023-10-01");

      const dateItem = createDateItem(date, baseEvents);

      // Assert that the date property matches the input date
      expect(dateItem.date).toEqual(date);

      // Assert that the events property contains the provided events
      expect(dateItem.events).toEqual(baseEvents);
    });
  });
  describe("previousCalendarOverlap function", () => {
    it("returns an empty array when the week starts on Sunday (weekIndex is 0)", () => {
      const lowerDateRange = new Date("2023-10-01"); // A Sundy
      const result = previousCalendarOverlap(lowerDateRange);

      expect(result).toEqual([]); // Expect an empty array
    });

    it("returns an array of date items for the previous days in the same week", () => {
      const lowerDateRange = new Date("2023-10-04"); // A Wednesday which is index3
      const expectedDateItems = [
        createDateItem(subDays(lowerDateRange, 3)), // Previous Sunday
        createDateItem(subDays(lowerDateRange, 2)), // Previous Monday
        createDateItem(subDays(lowerDateRange, 1)), // Previous Tuesday
      ];

      const result = previousCalendarOverlap(lowerDateRange);

      expect(result).toEqual(expectedDateItems);
    });

    it("returns an empty array when lowerDateRange is a specific date", () => {
      const lowerDateRange = new Date("2023-10-15"); // A specific date (e.g., Saturda)
      const result = previousCalendarOverlap(lowerDateRange);

      expect(result).toEqual([]); // Expect an empty array
    });
  });
  describe("nextCalendarOverlap function", () => {
    it("returns an empty array when the week starts on Saturday (weekIndex is 6)", () => {
      const upperDateRange = new Date("2023-10-07"); // A Saturdy
      const result = nextMonthsDateCalendarOverlap(upperDateRange);

      expect(result).toEqual([]); // Expect an empty array
    });

    it("returns an array of date items for the next days in the same week (week starts on Sunday)", () => {
      const upperDateRange = new Date("2023-10-03"); // A Tuesday which index is2
      const expectedDateItems = [
        createDateItem(addDays(upperDateRange, 0)), // Same Tuesday
        createDateItem(addDays(upperDateRange, 1)), // Next Wednesday
        createDateItem(addDays(upperDateRange, 2)), // Next Thursday
        createDateItem(addDays(upperDateRange, 3)), // Next Friday
        createDateItem(addDays(upperDateRange, 4)), // Next Saturday
        createDateItem(addDays(upperDateRange, 5)), // Next Sunday
      ];

      const result = nextMonthsDateCalendarOverlap(upperDateRange);

      expect(result).toEqual(expectedDateItems);
    });

    it("returns an array of date items for the next days in the same week (week starts on Monday)", () => {
      const upperDateRange = new Date("2023-10-04"); // A Wednesday which is index3
      const expectedDateItems = [
        createDateItem(addDays(upperDateRange, 0)), // Same Wednesday
        createDateItem(addDays(upperDateRange, 1)), // Next Thursday
        createDateItem(addDays(upperDateRange, 2)), // Next Friday
        createDateItem(addDays(upperDateRange, 3)), // Next Saturday
        createDateItem(addDays(upperDateRange, 4)), // Next Sunday
        createDateItem(addDays(upperDateRange, 5)), // Next Monday
      ];

      const result = nextMonthsDateCalendarOverlap(upperDateRange);

      expect(result).toEqual(expectedDateItems);
    });
  });

  describe("createEmptyDateItems function", () => {
    it("throws an error when the lowerDateRange is after the upperDateRange", () => {
      const lowerDateRange = new Date("2023-10-15"); // A later dae
      const upperDateRange = new Date("2023-10-10"); // An earlier dae

      // Use a function to catch the error
      const createEmptyDateItemsWithError = () => {
        createEmptyDateItems(lowerDateRange, upperDateRange);
      };

      expect(createEmptyDateItemsWithError).toThrowError(
        "the lowerDateRange needs to be before the upperDateRange"
      );
    });

    it("returns an array of date items for a valid date range", () => {
      const lowerDateRange = new Date("2023-10-01"); // Start dae
      const upperDateRange = new Date("2023-10-05"); // End dae
      const expectedDateItems = [
        createDateItem(lowerDateRange),
        createDateItem(addDays(lowerDateRange, 1)),
        createDateItem(addDays(lowerDateRange, 2)),
        createDateItem(addDays(lowerDateRange, 3)),
        createDateItem(addDays(lowerDateRange, 4)),
      ];

      const result = createEmptyDateItems(lowerDateRange, upperDateRange);

      expect(result).toEqual(expectedDateItems);
    });

    it("returns an empty array when the date range is a single day", () => {
      const lowerDateRange = new Date("2023-10-10");
      const upperDateRange = new Date("2023-10-10");
      const result = createEmptyDateItems(lowerDateRange, upperDateRange);

      expect(result).toEqual([]); // Expect an empty array
    });
  });

  describe("withinRange", () => {
    it("returns true for a date within the date range", () => {
      const date = new Date("2023-10-15");
      const lowerDateRange = new Date("2023-10-10");
      const upperDateRange = new Date("2023-10-20");

      const result = withinRange(date, lowerDateRange, upperDateRange);

      expect(result).toBe(true); // Expect true
    });

    it("returns true for a date equal to the lower date range", () => {
      const date = new Date("2023-10-10"); // Equal to lowerDateRane
      const lowerDateRange = new Date("2023-10-10");
      const upperDateRange = new Date("2023-10-20");

      const result = withinRange(date, lowerDateRange, upperDateRange);

      expect(result).toBe(true); // Expect true
    });

    it("returns true for a date equal to the upper date range", () => {
      const date = new Date("2023-10-20"); // Equal to upperDateRane
      const lowerDateRange = new Date("2023-10-10");
      const upperDateRange = new Date("2023-10-20");

      const result = withinRange(date, lowerDateRange, upperDateRange);

      expect(result).toBe(true); // Expect true
    });

    it("returns false for a date outside the date range", () => {
      const date = new Date("2023-10-05"); // Outside the date rane
      const lowerDateRange = new Date("2023-10-10");
      const upperDateRange = new Date("2023-10-20");

      const result = withinRange(date, lowerDateRange, upperDateRange);

      expect(result).toBe(false); // Expect false
    });
  });
  describe("getWeeklyStartDate", () => {
    it("returns the same start_date when the day of the week interval matches", () => {
      const start_date = new Date("2023-10-20"); // A Friday
      const interval = 5; // Friday

      const result = getWeeklyStartDate(start_date, interval);

      expect(result).toEqual(start_date); // Expect the same start_date
    });

    it("returns the next week start_date when the day of the week interval does not match", () => {
      const start_date = new Date("2023-10-20"); // A Friday
      const interval = 2; // Tuesday
      const expectedStartDate = new Date("2023-10-24"); // Next Tuesdy

      const result = getWeeklyStartDate(start_date, interval);

      expect(result).toEqual(expectedStartDate); // Expect the next week's start_date
    });

    it("handles yearly changeover correctly", () => {
      const start_date = new Date("2023-12-31"); // UTC time, a Sunday
      const interval = 5; // Sunday

      const result = getWeeklyStartDate(start_date, interval);

      // The result should be the first Friday of the next year, which is '2024-01-05'
      const expectedDate = new Date("2024-01-05");

      expect(result.toISOString()).toBe(expectedDate.toISOString());
    });
  });

  describe("getMonthlyStartDate", () => {
    it("returns the same start_date when the date interval matches", () => {
      const start_date = new Date("2023-10-15");
      const interval = 15; // The same day of the month

      const result = getMonthlyStartDate(start_date, interval);

      expect(result).toEqual(start_date); // Expect the same start_date
    });

    it("returns the next month start_date when the date interval is smaller", () => {
      const start_date = new Date("2023-10-26");
      const interval = 25; // A day earlier in the month
      const expectedStartDate = new Date("2023-11-25");

      const result = getMonthlyStartDate(start_date, interval);

      expect(result).toEqual(expectedStartDate); // Expect the start_date of the next month
    });

    it("handles next month with fewer days", () => {
      const start_date = new Date("2023-01-31"); // January 31, 2023
      const interval = 30; // Attempting to set to the 30th day (which doesn't exist in February)

      const result = getMonthlyStartDate(start_date, interval);

      // The result should be adjusted to February 28 (in a non-leap year)
      const expectedDate = new Date("2023-02-28");

      expect(result.toISOString()).toBe(expectedDate.toISOString());
    });
  });

  describe("getAnnuallyStartDate", () => {
    it("returns the same start_date when the day of the year interval matches", () => {
      const start_date = new Date(2023, 9, 24);
      const interval = 297; // The same day of the year

      const result = getAnnuallyStartDate(start_date, interval);

      expect(result).toEqual(start_date); // Expect the same start_date
    });

    it("returns the next year start_date when the day of the year interval is smaller and is a leap year", () => {
      const start_date = new Date("2023-10-20");
      const interval = 292; // A day earlier in the year
      const expectedStartDate = new Date("2024-10-19");

      const result = getAnnuallyStartDate(start_date, interval);

      expect(result).toEqual(expectedStartDate); // Expect the start_date of the next year
    });
  });

  describe("filterEventsByRange", () => {
    it("returns the event that matches the date range", () => {
      const date = new Date("2023-10-15");
      const lowerDateRange = new Date("2023-10-10");
      const upperDateRange = new Date("2023-10-20");
      const event = baseEvents[0];

      const eventsByService = [event];
      const result = filterEventsByRange(
        eventsByService,
        date,
        lowerDateRange,
        upperDateRange
      );

      expect(result).toEqual(event); // Expect the event within the date range
    });

    it("returns undefined for events outside the date range", () => {
      const date = new Date("2023-10-05"); // Outside the date range
      const lowerDateRange = new Date("2023-10-10");
      const upperDateRange = new Date("2023-10-20");
      const event = createEvent({} as any, date);

      const eventsByService = [event];
      const result = filterEventsByRange(
        eventsByService,
        date,
        lowerDateRange,
        upperDateRange
      );

      expect(result).toBeUndefined(); // Expect undefined for events outside the date range
    });
  });
});
