<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { AuthApiError } from '@/services/modules/auth.service'
import { emailIsValid } from '@/utils/validators'

const route = useRoute()
const router = useRouter()
const { login, isLoading } = useAuth()
const form = reactive({ email: '', password: '' })
const fieldErrors = reactive<{ email: string; password: string }>({ email: '', password: '' })
const error = ref('')

const clearErrors = () => {
  error.value = ''
  fieldErrors.email = ''
  fieldErrors.password = ''
}

const validateForm = (): boolean => {
  if (!form.email.trim()) {
    fieldErrors.email = 'Email is required.'
  } else if (!emailIsValid(form.email)) {
    fieldErrors.email = 'Enter a valid work email address.'
  }

  if (!form.password.trim()) {
    fieldErrors.password = 'Password is required.'
  }

  return !fieldErrors.email && !fieldErrors.password
}

const submit = async () => {
  clearErrors()
  if (!validateForm()) {
    return
  }

  try {
    await login(form.email, form.password)
    const redirect = typeof route.query.redirect === 'string' && route.query.redirect.startsWith('/')
      ? route.query.redirect
      : '/dashboard'
    await router.push(redirect)
  } catch (loginError) {
    if (loginError instanceof AuthApiError) {
      fieldErrors.email = loginError.fieldErrors.email ?? ''
      fieldErrors.password = loginError.fieldErrors.password ?? ''
      error.value = Object.keys(loginError.fieldErrors).length > 0 ? '' : loginError.message
      return
    }

    error.value = 'Login failed. Please verify your credentials.'
  }
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-3xl font-semibold text-[#1A1A2E]">Sign in to Astra</h2>
      <p class="mt-2 text-sm text-[#4B4B6B]">Access loan pipelines, approvals, and customer insights with enterprise security.</p>
    </div>

    <form @submit.prevent="submit" class="space-y-5" novalidate>
      <div class="space-y-2">
        <label class="block text-sm font-medium text-[#4B4B6B]" for="email">Email</label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          autocomplete="username"
          :aria-invalid="Boolean(fieldErrors.email)"
          aria-describedby="email-error"
          class="w-full rounded-3xl border bg-surface-muted px-4 py-3 text-sm text-[#1A1A2E] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
          :class="fieldErrors.email ? 'border-red-300' : 'border-surface-border'"
        />
        <p v-if="fieldErrors.email" id="email-error" class="px-4 text-sm text-red-700">{{ fieldErrors.email }}</p>
      </div>

      <div class="space-y-2">
        <label class="block text-sm font-medium text-[#4B4B6B]" for="password">Password</label>
        <input
          id="password"
          v-model="form.password"
          type="password"
          autocomplete="current-password"
          :aria-invalid="Boolean(fieldErrors.password)"
          aria-describedby="password-error"
          class="w-full rounded-3xl border bg-surface-muted px-4 py-3 text-sm text-[#1A1A2E] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
          :class="fieldErrors.password ? 'border-red-300' : 'border-surface-border'"
        />
        <p v-if="fieldErrors.password" id="password-error" class="px-4 text-sm text-red-700">{{ fieldErrors.password }}</p>
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
