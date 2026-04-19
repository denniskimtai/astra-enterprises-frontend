<template>
  <div class="grid min-h-[calc(100vh-4rem)] place-items-center p-6">
    <div class="max-w-lg rounded-[32px] bg-white p-10 shadow-soft text-center">
      <h1 class="text-5xl font-semibold text-[#1A1A2E]">404</h1>
      <p class="mt-4 text-xl font-medium text-[#4B4B6B]">Page not found</p>
      <p class="mt-2 text-sm text-[#6B7280]">The route you are looking for does not exist or may require additional permissions.</p>
      <router-link
        to="/dashboard"
        class="mt-6 inline-flex rounded-3xl bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-light"
      >
        Go to dashboard
      </router-link>
    </div>
  </div>
</template>
