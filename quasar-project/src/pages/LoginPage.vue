<template>
  <q-layout view="lHh Lpr lFf" class="login-layout">

    <q-img
      src="https://images.unsplash.com/photo-1565687981296-535f09db714e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8RXN0dWRhbnRlcyUyMGRlJTIwcHJvZ3JhbWElQzMlQTclQzMlQTNvfGVufDB8fDB8fHww"
      class="login-bg"
      fit="cover"
    />

    <div class="login-overlay"></div>

    <q-page-container>
      <q-page class="flex flex-center">

        <q-card class="login-card q-pa-lg shadow-10">
          <q-card-section class="text-h6 text-center q-mb-md text-white">
            Login
          </q-card-section>

          <q-form @submit.prevent="fazerLogin">
            <q-card-section class="q-gutter-md">

              <q-input
                v-model="email"
                label="E-mail"
                type="email"
                dense
                filled
                bg-color="white"
                autocomplete="email"
              >
                <template #prepend>
                  <q-icon name="mail" color="primary" />
                </template>
              </q-input>

              <q-input
                v-model="senha"
                label="Senha"
                type="password"
                dense
                filled
                bg-color="white"
                autocomplete="current-password"
              >
                <template #prepend>
                  <q-icon name="lock" color="primary" />
                </template>
              </q-input>

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
                unelevated
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
  QForm,
  QImg,
  QIcon
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

<style scoped>
.login-layout {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
}

.login-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.login-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1;
}

.q-page {
  position: relative;
  z-index: 2;
}

.login-card {
  min-width: 350px;
  width: 380px;

  background: rgba(10, 10, 20, 0.35);              
  backdrop-filter: blur(16px) saturate(150%);      
  -webkit-backdrop-filter: blur(16px) saturate(150%);

  border-radius: 16px;                             
  border: 1px solid rgba(168, 85, 247, 0.7);       
  box-shadow:
    0 18px 45px rgba(0, 0, 0, 0.75),
    0 0 0 1px rgba(0, 0, 0, 0.3);                 
}
</style>
