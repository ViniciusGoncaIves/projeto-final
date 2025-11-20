<!-- src/pages/CadastroAlunoPage.vue -->
<template>
  <q-page class="q-pa-md">
    <q-card flat bordered class="q-pa-md">
      <div class="text-h6 q-mb-md">
        Cadastro de Alunos
      </div>

      <q-banner
        v-if="alunoStore.erro"
        class="q-mb-md"
        dense
        rounded
        color="negative"
        text-color="white"
      >
        {{ alunoStore.erro }}
      </q-banner>

      <div class="row items-center q-gutter-sm q-mb-md">
        <q-btn
          label="Recarregar"
          icon="refresh"
          color="primary"
          @click="carregarDados"
          :loading="alunoStore.carregando || turmaStore.carregando"
        />

        <q-btn
          label="Novo aluno"
          icon="add"
          color="positive"
          @click="novoAluno"
        />
      </div>

      <q-table
        title="Lista de alunos"
        :rows="alunoStore.lista"
        :columns="colunas"
        row-key="id"
        flat
        bordered
        :loading="alunoStore.carregando"
        no-data-label="Nenhum aluno cadastrado."
      >
        <template #body-cell-acoes="props">
          <q-td :props="props">
            <q-btn
              flat
              dense
              round
              icon="edit"
              color="primary"
              @click="editarAluno(props.row)"
            />
            <q-btn
              flat
              dense
              round
              icon="delete"
              color="negative"
              class="q-ml-xs"
              @click="removerAluno(props.row.id)"
            />
          </q-td>
        </template>
      </q-table>
    </q-card>

    <q-dialog v-model="dialogoVisivel" persistent>
      <q-card style="min-width: 500px">
        <q-card-section class="text-h6">
          {{ modoEdicao ? 'Editar aluno' : 'Novo aluno' }}
        </q-card-section>

        <q-card-section class="q-gutter-md">
          <q-input
            v-model="alunoEmEdicao.nome"
            label="Nome"
            dense
            outlined
          />
          <q-input
            v-model="alunoEmEdicao.cpf"
            label="CPF"
            dense
            outlined
          />
          <q-input
            v-model="alunoEmEdicao.data_nascimento"
            label="Data de nascimento"
            dense
            outlined
            hint="Formato livre (ex: 2007-02-15 ou 20/07/2001)"
          />
          <q-input
            v-model="alunoEmEdicao.email"
            label="E-mail"
            dense
            outlined
          />
          <q-input
            v-model="alunoEmEdicao.telefone"
            label="Telefone"
            dense
            outlined
          />

          <q-select
            v-model="turmaSelecionadaId"
            :options="opcoesTurma"
            label="Turma"
            dense
            outlined
            emit-value
            map-options
            clearable
            hint="Selecione a turma do aluno"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            label="Cancelar"
            color="negative"
            v-close-popup
          />
          <q-btn
            flat
            label="Salvar"
            color="primary"
            :loading="alunoStore.carregando || turmaStore.carregando"
            @click="salvarAluno"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { onMounted, reactive, ref, computed } from 'vue'
import { useAlunoStore } from 'src/stores/aluno-store'
import { useTurmaStore } from 'src/stores/turma-store'

const alunoStore = useAlunoStore()
const turmaStore = useTurmaStore()

const colunas = [
  { name: 'id', label: 'ID', field: 'id', align: 'left', sortable: true },
  { name: 'nome', label: 'Nome', field: 'nome', align: 'left', sortable: true },
  { name: 'cpf', label: 'CPF', field: 'cpf', align: 'left' },
  { name: 'email', label: 'E-mail', field: 'email', align: 'left' },
  { name: 'telefone', label: 'Telefone', field: 'telefone', align: 'left' },
  { name: 'acoes', label: 'Ações', field: 'acoes', align: 'center' }
]

const dialogoVisivel = ref(false)
const modoEdicao = ref(false)

const alunoEmEdicao = reactive({
  id: null,
  nome: '',
  cpf: '',
  data_nascimento: '',
  email: '',
  telefone: ''
})

// turma selecionada no form (id da turma)
const turmaSelecionadaId = ref(null)

// opções de turma para o combo
const opcoesTurma = computed(() =>
  turmaStore.lista.map(t => ({
    label: t.nome,
    value: t.id
  }))
)

const limparAlunoEmEdicao = () => {
  alunoEmEdicao.id = null
  alunoEmEdicao.nome = ''
  alunoEmEdicao.cpf = ''
  alunoEmEdicao.data_nascimento = ''
  alunoEmEdicao.email = ''
  alunoEmEdicao.telefone = ''
  turmaSelecionadaId.value = null
}

const carregarDados = async () => {
  await Promise.all([
    alunoStore.carregarTodos(),
    turmaStore.carregarTodas()
  ])
}

const novoAluno = () => {
  modoEdicao.value = false
  limparAlunoEmEdicao()
  dialogoVisivel.value = true
}

const editarAluno = (aluno) => {
  modoEdicao.value = true
  alunoEmEdicao.id = aluno.id
  alunoEmEdicao.nome = aluno.nome
  alunoEmEdicao.cpf = aluno.cpf
  alunoEmEdicao.data_nascimento = aluno.data_nascimento
  alunoEmEdicao.email = aluno.email
  alunoEmEdicao.telefone = aluno.telefone

  turmaSelecionadaId.value = null

  dialogoVisivel.value = true
}

const salvarAluno = async () => {
  try {
    const payload = {
      nome: alunoEmEdicao.nome,
      cpf: alunoEmEdicao.cpf,
      data_nascimento: alunoEmEdicao.data_nascimento,
      email: alunoEmEdicao.email,
      telefone: alunoEmEdicao.telefone
    }

    let alunoSalvo

    if (modoEdicao.value && alunoEmEdicao.id != null) {
      alunoSalvo = await alunoStore.atualizarAluno(alunoEmEdicao.id, payload)
    } else {
      alunoSalvo = await alunoStore.criarAluno(payload)
    }

    // se tiver turma selecionada, vincula o aluno à turma
    if (turmaSelecionadaId.value) {
      const turma = turmaStore.lista.find(t => t.id === turmaSelecionadaId.value)
      if (turma) {
        // normaliza IDs pra string pra não dar pau em includes
        const alunosIds = Array.isArray(turma.alunos_ids)
          ? turma.alunos_ids.map(id => String(id))
          : []

        const idAlunoStr = String(alunoSalvo.id)

        if (!alunosIds.includes(idAlunoStr)) {
          alunosIds.push(idAlunoStr)
        }

        await turmaStore.atualizarTurma(turma.id, {
          nome: turma.nome,
          alunos_ids: alunosIds
        })
      }
    }

    dialogoVisivel.value = false
    await carregarDados()
  } catch (erro) {
    console.error(erro)
  }
}

const removerAluno = async (id) => {
  try {
    await alunoStore.removerAluno(id)
  } catch (erro) {
    console.error(erro)
  }
}

onMounted(() => {
  carregarDados()
})
</script>
