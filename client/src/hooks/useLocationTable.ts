import { useState, useEffect } from "react";

import {
  getAllLocations,
  createLocation,
  removeLocation,
  getLocation,
  updateLocation,
} from "../data/location.data";
import { ILocation } from "../data/responseTypes";
export default function useLocationTable() {
  const [error, setError] = useState<null | Error>(null);
  const [loading, setLoading] = useState(true);
  const [locations, setLocations] = useState<ILocation[]>([]);

  async function fetchLocations() {
    getAllLocations()
      .then((response) => {
        if (response.status >= 400) {
          throw new Error(response.toString());
        }
        return response.data;
      })
      .then((data) => {
        setLocations(data);
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    setLoading(true);
    fetchLocations();

    setLoading(false);
  }, []);

  async function newLocation(data: Pick<ILocation, "name">) {
    setLoading(true);
    await createLocation(data)
      .then((response) => {
        if (response.status >= 400) {
          throw new Error(response.status.toString());
        }
        return response.data;
      })
      .then((data) => {
        setLocations([...locations, data]);
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }

  async function deleteLocation(id: string) {
    setLoading(true);
    await removeLocation(id)
      .then((response) => {
        if (response.status >= 400) {
          console.error(response);
          throw new Error(response.status.toString());
        }
      })
      .then(() => {
        const index = locations.findIndex((local) => local._id === id);
        const newLocations = locations;
        newLocations.splice(index, 1);
        setLocations(newLocations);
        console.log(newLocations);
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }

  async function fetchLocation(id: string) {
    setLoading(true);
    const response = await getLocation(id);
    setLoading(false);
    if (response.status >= 400) {
      setError(new Error(response.status.toString()));
    }
    return response.data;
  }

  async function editLocation(newLocation: ILocation) {
    setLoading(true);
    await updateLocation(newLocation)
      .then((response) => {
        if (response.status >= 400) {
          setError(new Error(response.status.toString()));
        }
        return response.data;
      })
      .then((editedLocation) => {
        const index = locations.findIndex(
          (local) => local._id === editedLocation._id
        );
        const updatedLocations = locations;
        updatedLocations.splice(index, 1, editedLocation);
        setLocations(updatedLocations);
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }

  return {
    error,
    loading,
    locations,
    newLocation,
    deleteLocation,
    fetchLocation,
    editLocation,
  };
}
