const listCategories = {
    'web-dev': 'Web Developer',
    'web-pro': 'Web Programmer',
    'wp-dev': 'Wordpress Developer',
    'other': 'Other'
}

const routes = [
    {
        name: 'home',
        path: '/',
        component: {
            props: ['database'],
            data() {
                return {
                    items: [],
                    categories: listCategories,
                    skills: {},
                    loaded: false
                };
            },
            async created() {
                Object.keys(this.categories).forEach((item) => (this.items[item] = []));
                this.skills = this.database.skills;
                this.items = this.database.experience;
                this.loaded = true;
            },
            mounted() {},
            methods: {
                filterCategory(items, key) {
                    return items.filter((item) => item.category == key);
                },
            },
            template: '#home',
        },
    },
    {
        name: 'detail',
        path: '/project/:slug',
        component: {
            props: ['database'],
            data() {
                return {
                    slug: this.$route.params.slug,
                    item: {},
                };
            },
            created() {
                this.item = this.database.experience.find((item) => item.slug == this.slug);
                if (!this.item) this.$router.push({ path: '/', replace: true });
            },
            template: '#detail',
        },
    },
    {
        name: 'not-found',
        path: '/:pathMatch(.*)*',
        redirect: "/",
    },
];

const router = VueRouter.createRouter({
    history: VueRouter.createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        return { top: 0 };
    },
});

const app = Vue.createApp({
    data() {
        return {
            database: {
                skills: [],
                experience: []
            },
            dataLoaded: false  // Tambahkan properti ini untuk menandakan apakah data sudah selesai diambil
        };
    },
    methods: {},
    async mounted() {
        try {
            const response = await fetch('/assets/database.json', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            const body = await response.json();
            this.database = body;
            this.dataLoaded = true;  // Setelah data selesai diambil, atur properti dataLoaded menjadi true
        } catch (error) {
            console.error(error);
        }
    },
    template: '#app-view',
});

app.use(router);

// Gunakan event `beforeRouteEnter` untuk mengecek apakah data sudah selesai diambil sebelum masuk ke route
router.beforeEach(async (to, from, next) => {
    if (to.matched.some(record => record.meta.requiresData)) {
        if (!app.dataLoaded) {
            // Jika data belum selesai diambil, tunggu hingga selesai
            await new Promise(resolve => {
                const interval = setInterval(() => {
                    if (app.dataLoaded) {
                        clearInterval(interval);
                        resolve();
                    }
                }, 100);
            });
        }
    }
    next();
});

app.mount('#app');

