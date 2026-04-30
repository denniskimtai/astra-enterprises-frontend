<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { loginValidator } from '@/utils/validators'

const router = useRouter()
const { login, isLoading } = useAuth()
const form = reactive({ email: '', password: '' })
const error = ref('')

const submit = async () => {
  error.value = ''
  const validation = loginValidator({ email: form.email, password: form.password })
  if (!validation.valid) {
    error.value = validation.message
    return
  }

  const success = await login(form.email, form.password)
  if (success) {
    await router.push({ name: 'Dashboard' })
    return
  }

  error.value = 'Login failed. Please verify your credentials.'
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-3xl font-semibold text-[#1A1A2E]">Sign in to Astra</h2>
      <p class="mt-2 text-sm text-[#4B4B6B]">Access loan pipelines, approvals, and customer insights with enterprise security.</p>
    </div>

    <form @submit.prevent="submit" class="space-y-5">
      <div class="space-y-2">
        <label class="block text-sm font-medium text-[#4B4B6B]" for="email">Email</label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          autocomplete="username"
          class="w-full rounded-3xl border border-surface-border bg-surface-muted px-4 py-3 text-sm text-[#1A1A2E] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
        />
      </div>

      <div class="space-y-2">
        <label class="block text-sm font-medium text-[#4B4B6B]" for="password">Password</label>
        <input
          id="password"
          v-model="form.password"
          type="password"
          autocomplete="current-password"
          class="w-full rounded-3xl border border-surface-border bg-surface-muted px-4 py-3 text-sm text-[#1A1A2E] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
        />
      </div>

      <div class="flex items-center justify-between text-sm text-[#4B4B6B]">
        <span>Secure access with role-aware controls</span>
      </div>

      <button
        type="submit"
        :disabled="isLoading"
        class="inline-flex w-full justify-center rounded-3xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span v-if="!isLoading">Continue</span>
        <span v-else>Signing in...</span>
      </button>

      <p v-if="error" class="rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{{ error }}</p>
    </form>
  </div>
</template>
