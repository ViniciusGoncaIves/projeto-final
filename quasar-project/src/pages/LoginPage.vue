<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="flex flex-center bg-grey-2">
        <q-card class="q-pa-lg" style="min-width: 350px">
          <q-card-section class="text-h6 text-center q-mb-md">
            Login do Sistema
          </q-card-section>

          <q-form @submit.prevent="fazerLogin">
            <q-card-section class="q-gutter-md">
              <q-input
                v-model="email"
                label="E-mail"
                type="email"
                dense
                outlined
                autocomplete="email"
              />

              <q-input
                v-model="senha"
                label="Senha"
                type="password"
                dense
                outlined
                autocomplete="current-password"
              />

              <q-banner
                v-if="erroLogin"
                class="q-mt-sm"
                dense
                rounded
                color="negative"
                text-color="white"
              >
                {{ erroLogin }}
              </q-banner>
            </q-card-section>

            <q-card-actions align="right">
              <q-btn
                label="Entrar"
                color="primary"
                :loading="carregando"
                type="submit"  
              />
            </q-card-actions>
          </q-form>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  QLayout,
  QPageContainer,
  QPage,
  QCard,
  QCardSection,
  QCardActions,
  QInput,
  QBanner,
  QBtn,
  QForm
} from 'quasar'

const router = useRouter()

const email = ref('')
const senha = ref('')
const erroLogin = ref(null)
const carregando = ref(false)

const fazerLogin = async () => {
  if (carregando.value) return

  erroLogin.value = null
  carregando.value = true

  try {
    const emailValido = '123@gmail.com'
    const senhaValida = '123'

    if (email.value === emailValido && senha.value === senhaValida) {
      await router.push('/dashboard')
    } else {
      erroLogin.value = 'E-mail ou senha inválidos.'
    }
  } finally {
    carregando.value = false
  }
}
</script>
