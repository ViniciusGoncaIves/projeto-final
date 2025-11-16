const routes = [
  {
    path: '/',
    component: () => import('pages/LoginPage.vue')
  },

  {
    path: '/app',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/IndexPage.vue')
      },
      {
        path: 'alunos',
        component: () => import('pages/CadastroAlunoPage.vue')
      },
      {
        path: 'professores',
        component: () => import('pages/CadastroProfessorPage.vue')
      },
      {
        path: 'disciplinas',
        component: () => import('pages/CadastroDisciplinaPage.vue')
      }
    ]
  },

  // {
  //   path: '/',
  //   redirect: '/login'
  // },

  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
