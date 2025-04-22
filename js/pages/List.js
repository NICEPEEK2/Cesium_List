import { store } from "../main.js";
import { embed } from "../util.js";
import { score } from "../score.js";
import { fetchEditors, fetchlist } from "../content.js";

import Spinner from "../components/Spinner.js";
import levelAuthors from "../components/List/authors.js"

const roleIconMap = {
    owner: "crown",
    admin: "user-gear",
    helper: "user-shield",
    dev: "code",
    trial: "user-lock",
};

export default {
    components: { Spinner, levelAuthors },
    template: `
        <main v-if="loading">
            <Spinner></Spinner>
        </main>
        <main v-else class="page-list">
            <div class="list-container">
                <table class="list" v-if="list">
                    <tr v-for="([level, err], i) in list">
                        <td class="rank">
                            <p v-if="i + 1 <= 150" class="type-label-lg">#{{ i + 1 }}</p>
                            <p v-else class="type-label-lg">legacy</p>
                        </td>
                        <td class="level" :class="{ 'active': selected == i, 'error': !level }">
                            <button @click="selected = i">
                                <span class="type-label-lg">{{ level?.name || \`Error (\${err}.json)\` }}</span>
                            </button>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="level-container">
                <div class="level" v-if="level">
                    <h1>{{ level.name }}</h1>
                    <levelAuthors :author="level.author" :Создатели="level.Создатели" :Верифер="level.Верифер"></levelAuthors>
                    <div v-if="level.Шоукейс" class="tabs">
                        <button class="tab type-label-lg" :class="{selected: !toggledШоукейс}" @click="toggledШоукейс = false">
                            <span class="type-label-lg">Верификация</span>
                        </button>
                        <button class="tab" :class="{selected: toggledШоукейс}" @click="toggledШоукейс = true">
                            <span class="type-label-lg">Шоукейс</span>
                        </button>
                    </div>
                    <iframe class="vIdeo" Id="vIdeoframe" :src="vIdeo" frameborder="0"></iframe>
                    <ul class="stats">
                        <li>
                            <div class="type-title-sm">Количество очков за прохождение</div>
                            <p>{{ score(selected + 1, 100, level.percentToQualify) }}</p>
                        </li>
                        <li>
                            <div class="type-title-sm">Id</div>
                            <p>{{ level.Id }}</p>
                        </li>
                        <li>
                            <div class="type-title-sm">Пароль</div>
                            <p>{{ level.Пароль || 'Free to Copy' }}</p>
                        </li>
                    </ul>
                    <h2>Рекорды</h2>
                    <p v-if="selected + 1 <= 75"><strong>{{ level.percentToQualify }}%</strong> или лучше </p>
                    <p v-else-if="selected +1 <= 150"><strong>100%</strong> или лучше </p>
                    <p v-else>This level does not accept new Рекорды.</p>
                    <table class="Рекорды">
                        <tr v-for="record in level.Рекорды" class="record">
                            <td class="percent">
                                <p>{{ record.percent }}%</p>
                            </td>
                            <td class="user">
                                <a :href="record.link" target="_blank" class="type-label-lg">{{ record.user }}</a>
                            </td>
                            <td class="mobile">
                                <img v-if="record.mobile" :src="\`/assets/phone-landscape\${store.dark ? '-dark' : ''}.svg\`" alt="Mobile">
                            </td>
                            <td class="hz">
                                <p>{{ record.hz }}Hz</p>
                            </td>
                        </tr>
                    </table>
                </div>
                <div v-else class="level" style="height: 100%; justify-content: center; align-items: center;">
                    <p></p>
                </div>
            </div>
            <div class="meta-container">
                <div class="meta">
                    <div class="errors" v-show="errors.length > 0">
                        <p class="error" v-for="error of errors">{{ error }}</p>
                    </div>
                    <div class="og">
                        <p class="type-label-md">Original list by <a href="https://me.redlimerl.com/" target="_blank">Redlime</a></p>
                    </div>
                    <template v-if="editors">
                        <h3>Редакторы listа</h3>
                        <ol class="editors">
                            <li v-for="editor in editors">
                                <img :src="\`image/\${roleIconMap[editor.role]}\${store.dark ? '-dark' : ''}.svg\`" :alt="editor.role">
                                <a v-if="editor.link" class="type-label-lg link" target="_blank" :href="editor.link">{{ editor.name }}</a>
                                <p v-else>{{ editor.name }}</p>
                            </li>
                        </ol>
                    </template>
                    <h3>Правила подачи заявки</h3>
                    <p>
                       Использовать Читы, megahack и тд можно, однако у вас тогда должен быть включен Cheat индикатор а также мод меню вы должы показать в конце видео с верифом!
                    </p>
                    <p>
                       Для того чтобы ваш уровень вставили в list вам нужно обязательно это записать это на видео а также у вас должен быть на него рау футаж (Сырой футаж *ссылки на ютуб не принимаем*) тоесть условно полная запись с самого начало до самого окончания. А также запись нельзя редактировать в разных видео редакторах!
                    </p>
                    <p>
                       Чтобы ваш рекорд попал в list нужно чтобы на вашей записи были слышны клики а также при желании чтобы было больше доверия вы можете записать с hand cam проще говоря чтобы у вас было камера направлена на мышку или на то на чём вы играйте.
                    </p>
                    <p>
                        Ваше видео дольжно обязательно быть публичное если вы планируйте выкладывать на площадку Youtube.
                    </p>
                    <p>
                        На записе должны быть показаны количество попыток.
                    </p>
                    <p>
                        Если мы заметим что прохождение уровня вы прошли нечестно и выставляйте за честно то мы имеем полное право вас заблокировать из listа на неограниченный срок!
                    </p>
                    <p>
                        Уровни начинаю со сложности Insane Demon могут вставится в демон list.
                    </p>
                    <p>
                        За прохождение уровня даются баллы чем легче уровень тем меньше даёться баллов.
                    </p>
                    <p>
                        Всего мест в топе 100 дальше уровни которые сложные но уже не влезают в list попадают в beyond list.
                    </p>
                    <p>
                        Нельзя использовать секретные проходы и сваг роуты для прохождение уровня! Такие заявки будут просто игнорироватся!
                    </p>
                    <p>
                       На сайте если уровень в виде просто картинки значит что видео прохождение нету либо утеряно если в виде ссылки на ютуб то это значит что видео прохождение на ютубе.
                    <p> 
                </div>
            </div>
        </main>
    `,
    data: () => ({
        list: [],
        editors: [],
        loading: true,
        selected: 0,
        errors: [],
        roleIconMap,
        store,
        toggledШоукейс: false,
    }),
    computed: {
        level() {
            if (!this.list || this.list.length <= this.selected) {
              return null;
            }
            const selectedItem = this.list[this.selected];
            return selectedItem ? selectedItem[0] : null;
          },
        vIdeo() {
            if (!this.level.Шоукейс) {
                return embed(this.level.Верификация);
            }

            return embed(
                this.toggledШоукейс
                    ? this.level.Шоукейс
                    : this.level.Верификация
            );
        },
    },
    async mounted() {
        // HIde loading spinner
        this.list = await fetchlist();
        this.editors = await fetchEditors();

        // Error handling
        if (!this.list) {
            this.errors = [
                "Failed to load list. Retry in a few minutes or notify list staff.",
            ];
        } else {
            this.errors.push(
                ...this.list
                    .filter(([_, err]) => err)
                    .map(([_, err]) => {
                        return `Failed to load level. (${err}.json)`;
                    })
            );
            if (!this.editors) {
                this.errors.push("Failed to load list editors.");
            }
        }

        this.loading = false;
    },
    methods: {
        embed,
        score,
    },
};
