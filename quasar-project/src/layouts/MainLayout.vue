<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-header text-white shadow-2">
      <q-toolbar>

        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title class="logo-title">
          Sistema de Ensino
        </q-toolbar-title>

      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="layout-drawer text-white"
    >
      <q-list class="text-white">
        <q-item-label header class="drawer-header">
          Menu
        </q-item-label>

        <EssentialLink
          v-for="link in linksList"
          :key="link.titulo"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container class="bg-dark text-white">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import EssentialLink from 'components/EssentialLink.vue'

const $q = useQuasar()

const linksList = [
  {
    titulo: 'Início',
    to: '/dashboard',
    icone: 'home'
  },
  {
    titulo: 'Alunos',
    to: '/dashboard/alunos',
    icone: 'school'
  },
  {
    titulo: 'Professores',
    to: '/dashboard/professores',
    icone: 'person'
  },
  {
    titulo: 'Disciplinas',
    to: '/dashboard/disciplinas',
    icone: 'menu_book'
  },
  {
    titulo: 'Turmas',
    to: '/dashboard/turmas',
    icone: 'groups'
  },
  {
    titulo: 'Notas',
    to: '/dashboard/notas',
    icone: 'grading'
  },
  {
    titulo: 'Sair',
    to: '/',
    icone: 'logout'
  }
]

const leftDrawerOpen = ref(false)

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

onMounted(() => {
  $q.dark.set(true)
})
</script>

<style scoped>
.bg-header {
  background: linear-gradient(90deg, #3b2a63, #7c4dff);
}

.layout-drawer {
  background: #2c2145;
}

.logo-title {
  font-weight: 600;
  letter-spacing: 0.03em;
}

.drawer-header {
  font-size: 0.9rem;
  text-transform: uppercase;
  opacity: 0.8;
}
</style>
