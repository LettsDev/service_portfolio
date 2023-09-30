import { useState, useEffect } from "react";
import locationApi from "../data/location.data";
import resourceApi from "../data/resource.data";
import { ILocation, IResource } from "../data/responseTypes";
export default function useLocationTable() {
  const [error, setError] = useState<null | Error>(null);
  const [loading, setLoading] = useState(true);
  const [locations, setLocations] = useState<ILocation[]>([]);
  const [resources, setResources] = useState<IResource[]>([]);
  useEffect(() => {
    async function fetchLocations() {
      await locationApi
        .getAll()
        .then((response) => {
          if (response.status >= 400) {
            throw new Error(response.status.toString());
          }
          return response.data;
        })
        .then((data) => {
          setLocations(data);
        })
        .catch((error) => setError(error))
        .finally(() => setLoading(false));
    }
    async function fetchResources() {
      await resourceApi
        .getAll()
        .then((response) => {
          if (response.status >= 400) {
            throw new Error(response.status.toString());
          }
          return response.data;
        })
        .then((data) => {
          setResources(data);
        })
        .catch((error) => setError(error))
        .finally(() => setLoading(false));
    }

    fetchLocations();
    fetchResources();
  }, []);
  return { error, loading, locations, resources };
}
