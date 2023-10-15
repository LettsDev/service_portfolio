import { useState, useEffect } from "react";
import { IResource, IResourceSubmit, IResourceSubmitEdit } from "../types";
import { useLoaderData } from "react-router-dom";
import fetchWithCatch from "../utils/fetchWithCatch";
export default function UseResourceTable() {
  const [loading, setLoading] = useState(true);
  const [resources, setResources] = useState<IResource[]>([]);

  const loadedResources = useLoaderData() as IResource[];

  useEffect(() => {
    setLoading(true);
    setResources(loadedResources);
    setLoading(false);
  }, []);

  async function deleteResource(id: string) {
    setLoading(true);
    await fetchWithCatch<IResource>({
      url: `resource/${id}`,
      method: "delete",
    });
    const index = resources.findIndex((local) => local._id === id);
    const newResources = resources;
    newResources.splice(index, 1);
    setResources(newResources);
    setLoading(false);
  }

  async function newResource(data: IResourceSubmit) {
    setLoading(true);
    //does not populate numServices on a newly created resource
    const newResource = await fetchWithCatch<Omit<IResource, "numServices">>({
      url: "resource",
      method: "post",
      data: data,
    });
    const fullNewResource = await fetchWithCatch<IResource>({
      url: `resource/${newResource._id}`,
      method: "get",
      data: data,
    });

    setResources([...resources, fullNewResource]);
    setLoading(false);
  }

  async function editResource(newResource: IResourceSubmitEdit) {
    setLoading(true);
    const editedResource = await fetchWithCatch<IResource>({
      url: `resource/${newResource._id}`,
      method: "put",
      data: newResource,
    });
    const index = resources.findIndex((local) => local._id === newResource._id);
    const updatedResources = resources;
    updatedResources.splice(index, 1, editedResource);
    setResources(updatedResources);
    setLoading(false);
  }

  return {
    loading,
    resources,
    newResource,
    deleteResource,
    editResource,
  };
}
