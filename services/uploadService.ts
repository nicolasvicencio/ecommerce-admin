import axios from "axios";

export default {
  getUploads: async () => {
    const uploads = await axios.get("/api/upload");
    return uploads.data;
  },
  getUploadById: async (id: string) => {
    const upload = await axios.get(`/api/upload?id=${id}`);
    return upload.data;
  },
  deleteUpload: async (id: string) => {
    const deletedUpload = await axios.delete(`/api/upload?id=${id}`);
    return deletedUpload.data;
  },
  createUpload: async (data: FormData) => {
    const upload = await axios.post("/api/upload", data);
    return upload.data;
  },
};
