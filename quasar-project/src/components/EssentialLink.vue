<template>
  <q-item
    clickable
    v-ripple
    tag="router-link"
    :to="props.to"
  >
    <q-item-section v-if="props.icone" avatar>
      <q-icon :name="props.icone" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ props.titulo }}</q-item-label>
      <q-item-label v-if="props.descricao" caption>
        {{ props.descricao }}
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup>
const props = defineProps({
  titulo: {
    type: String,
    required: true
  },
  descricao: {
    type: String,
    default: ''
  },
  icone: {
    type: String,
    default: ''
  },
  to: {
    type: [String, Object],
    required: true
  }
})
</script>
