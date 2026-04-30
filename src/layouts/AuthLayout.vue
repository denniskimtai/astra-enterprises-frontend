<template>
  <div class="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(79,25,100,0.15),_transparent_45%),#F8F7FA] flex items-center justify-center px-4 py-8">
    <div class="w-full max-w-md rounded-[32px] border border-surface-border bg-white/95 p-8 shadow-soft backdrop-blur-sm">
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-semibold text-[#1A1A2E]">Astra Enterprise Loans</h1>
        <p class="mt-2 text-sm text-[#4B4B6B]">Secure, role-aware loan management for enterprise teams.</p>
      </div>
      <slot />
    </div>
  </div>
</template>
