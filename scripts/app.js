const listCategories = {
    'web-dev': 'Web Developer',
    'web-pro': 'Web Programmer',
    'wp-dev': 'Wordpress Developer',
    'other': 'Other'
}
async function database(){
    try {
        let response = await fetch('/assets/database.json', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        let body = await response.json();
        return body;
    } catch (error) {
        console.error(error);
    }
}
const scrollPosition = {
    x:0, y:0
}
const routes = [
    {
        name: 'home',
        path: '/',
        component: {
            emits: ['loadoff'],
            data() { return {
                db: null,
                items: [],
                categories: listCategories,
                skills: {},
                lang: localStorage.getItem('lang') || 'en'
            }},
            async created() {
                Object.keys(this.categories).forEach((item) => (this.items[item] = []));
                this.db = await database();
                this.skills = this.db.skills;
                this.items = this.db.experience;
                this.$emit('loadoff');
                setTimeout(() => window.scrollTo(scrollPosition.x, scrollPosition.y), 1);
                return true;
            },
            methods: {
                filterCategory(items, key) {
                    return items.filter((item) => item.category == key);
                },
            },
            mounted() {},
            beforeRouteLeave(to, from, next) {
                scrollPosition.x = window.scrollX;
                scrollPosition.y = window.scrollY;
                next();
            },
            template: '#home',
        },
    },
    {
        name: 'detail',
        path: '/project/:slug',
        component: {
            emits: ['loadoff'],
            data() { return {
                db: null,
                slug: this.$route.params.slug,
                item: null,
                info: null,
                lang: localStorage.getItem('lang') || 'en'
            }},
            async created() {
                this.db = await database();
                this.item = this.db.experience.find((item) => item.slug == this.slug);
                if (!this.item) this.$router.push({ path: '/', replace: true });
                let lang = localStorage.getItem('lang') || 'en';
                this.$emit('loadoff');
                return true;
            },
            mounted() {
                window.scrollTo(0, 0);
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
});

const app = Vue.createApp({
    data() { return {
        loading: true,
        lang: localStorage.getItem('lang') || 'en',
        job: {
            "id": "Pekerja Lepas asal Bali",
            "en": "Freelancers from Bali"
        }
    }},
    methods: {
        loadoff() {
            this.loading = false
        },
        switchLang() {
            let lang = this.lang == 'en' ? 'id' : 'en'
            localStorage.setItem('lang', lang);
            this.$router.go(0);
        },
        upper(value){
            if(!value) return ''
                value = value.toString()
            return value.toUpperCase()
        },
    },
    template: '#app-view',
});

app.use(router);
app.mount('#app');

