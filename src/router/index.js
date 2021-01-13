import Vue from "vue";
import VueRouter from "vue-router";
import Search from "../views/Search.vue";
import Recommend from "../views/Recommend.vue";
import Playlist from "../views/Playlist.vue";

Vue.use(VueRouter);

const routes = [
    {
        path: "/",
        name: "Recommend",
        component: Recommend,
        meta: { isShowNav: true },
    },
    {
        path: "/hot",
        name: "Hot",
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
            import(/* webpackChunkName: "about" */ "../views/Hot.vue"),
        meta: { isShowNav: true },
    },

    {
        path: "/search",
        name: "Search",
        component: Search, 
        meta: { isShowNav: true },
    },
    {
        path: "/playlist",
        name: "Playlist",
        component: Playlist, 
        meta: { isShowNav: false },
    },

   
];

const router = new VueRouter({
    routes,
});

export default router;
