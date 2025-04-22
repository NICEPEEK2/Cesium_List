export default {
    props: {
        author: {
            type: String,
            required: true,
        },
        Создатели: {
            type: Array,
            required: true,
        },
        Верифер: {
            type: String,
            required: true,
        },
    },
    template: `
        <div class="level-authors">
            <template v-if="selfVerified">
                <div class="type-title-sm">Creator & Верифер</div>
                <p class="type-body">
                    <span>{{ author }}</span>
                </p>
            </template>
            <template v-else-if="Создатели.length === 0">
                <div class="type-title-sm">Creator</div>
                <p class="type-body">
                    <span>{{ author }}</span>
                </p>
                <div class="type-title-sm">Верифер</div>
                <p class="type-body">
                    <span>{{ Верифер }}</span>
                </p>
            </template>
            <template v-else>
                <div class="type-title-sm">Создатели</div>
                <p class="type-body">
                    <template v-for="(creator, index) in Создатели" :key="\`creator-\$\{creator\}\`">
                        <span >{{ creator }}</span
                        ><span v-if="index < Создатели.length - 1">, </span>
                    </template>
                </p>
                <div class="type-title-sm">Верифер</div>
                <p class="type-body">
                    <span>{{ Верифер }}</span>
                </p>
            </template>
            <div class="type-title-sm">Публикатор</div>
            <p class="type-body">
                <span>{{ author }}</span>
            </p>
        </div>
    `,

    computed: {
        selfVerified() {
            return this.author === this.Верифер && this.Создатели.length === 0;
        },
    },
};
