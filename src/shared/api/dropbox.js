import axios from "axios";
import { create } from "zustand";
import { url } from "./vars";

const useDropBox = create((set) => ({
      collections: ["piano"],
      one: null,          
      getCollection: async (title) => {
            try {
                  const res = await axios.get(`${url}/api/collections/by-title/${title}`);
                  console.log(res);
                  set({ one: res.data })
            } catch (error) {
                  console.log(error);
            }
      },
      getCollections: async () => {
            try {
                  const res = await axios.get(`${url}/api/collections`);
                  console.log(res);
                  set({ collections: res.data })
            } catch (error) {
                  console.log(error);
            }
      },
}))
export default useDropBox