import { expect, it, describe } from "vitest";
import {
  IsoToDate,
  dateToIso,
  getUtcEquivalent,
  toIServiceDated,
} from "../../utils/dateConversion";
import { IService } from "../../types";

describe("dateConversion functions", () => {
  describe("getUtcEquivalent function", () => {
    it("should return the correct date", () => {
      const date = new Date("2023-11-09");
      const result = getUtcEquivalent(date);
      expect(result).toEqual(new Date(Date.UTC(2023, 10, 8)));
    });
  });

  describe("IsoToDate function", () => {
    it("should return the correct date", () => {
      const ISO = new Date("2023-11-09").toISOString();
      const result = IsoToDate(ISO);
      expect(result).toEqual(new Date(Date.UTC(2023, 10, 9, 20)));
    });
  });

  describe("dateToIso function", () => {
    it("should return correct date string", () => {
      const result = dateToIso(new Date("2023, 11, 09"));
      expect(result).toEqual(new Date("2023-11-09").toISOString());
    });
  });
  describe("toIServiceDated function", () => {
    it("should return the correct IServiceDated object ", () => {
      const service: IService = {
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
        start_date: "2023-11-20T00:00:00.000Z",
        completion_date: "2023-11-20T00:00:00.000Z",
        interval: 1,
        frequency: "ONCE",
        __v: 0,
        createdAt: "2023-10-01T00:00:00.000Z",
        updatedAt: "2023-10-01T00:00:00.000Z",
      };

      const datedService = toIServiceDated(service);
      expect(datedService.completion_date).toEqual(
        new Date("November 20, 2023, 12:00")
      );
    });
  });
});
