import { defineStore } from "pinia";

export const useProStore = defineStore("pro", {
    state: () => ({
        myProcjects: [],
        loading: false,
    }),
    actions: () => ({
        setTempProject(project) {
            this.myProcjects = project;
        },
    }),

});