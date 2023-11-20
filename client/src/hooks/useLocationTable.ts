import { useState, useEffect } from "react";
import { useLoaderData } from "react-router-dom";
import { ILocation } from "../types";
import fetchWithCatch from "../utils/fetchWithCatch";

export default function useLocationTable() {
  const [loading, setLoading] = useState(true);
  const [locations, setLocations] = useState<ILocation[]>([]);
  const loadedLocations = useLoaderData() as ILocation[];

  useEffect(() => {
    setLoading(true);
    setLocations(loadedLocations);
    setLoading(false);
  }, []);

  async function newLocation(data: Pick<ILocation, "name">) {
    setLoading(true);
    //does not populate numResources on a newly created location
    const newLocation = await fetchWithCatch<Omit<ILocation, "numResources">>({
      url: "location",
      method: "post",
      data: data,
    });

    const fullNewLocation = await fetchWithCatch<ILocation>({
      url: `location/${newLocation._id}`,
      method: "get",
    });
    console.log(fullNewLocation);
    setLocations([...locations, fullNewLocation]);
    setLoading(false);
    return fullNewLocation;
  }

  async function deleteLocation(id: string) {
    setLoading(true);
    await fetchWithCatch<ILocation>({
      url: `location/${id}`,
      method: "delete",
    });
    const index = locations.findIndex((local) => local._id === id);
    const newLocations = locations;
    newLocations.splice(index, 1);
    setLocations(newLocations);
    setLoading(false);
  }

  async function editLocation(newLocation: ILocation) {
    setLoading(true);
    const editedLocation = await fetchWithCatch<ILocation>({
      url: `location/${newLocation._id}`,
      method: "put",
      data: newLocation,
    });
    const index = locations.findIndex(
      (local) => local._id === editedLocation._id
    );
    const updatedLocations = locations;
    updatedLocations.splice(index, 1, editedLocation);
    setLocations(updatedLocations);
    setLoading(false);
  }

  return {
    loading,
    locations,
    newLocation,
    deleteLocation,
    editLocation,
    setLoading,
  };
}
