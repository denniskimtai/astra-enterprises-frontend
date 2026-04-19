<template>
  <div class="space-y-6">
    <div class="rounded-[28px] bg-white p-8 shadow-soft">
      <h1 class="text-2xl font-semibold text-[#1A1A2E]">System Administration</h1>
      <p class="mt-2 text-sm text-[#4B4B6B]">Manage system settings, user roles, and platform configuration.</p>
    </div>

    <div class="grid gap-6 md:grid-cols-2">
      <div class="rounded-[28px] bg-white p-6 shadow-soft">
        <h2 class="text-lg font-semibold text-[#1A1A2E]">User Management</h2>
        <p class="mt-2 text-sm text-[#4B4B6B]">Create and manage user accounts with role assignments.</p>
        <div class="mt-4 space-y-2">
          <div class="flex justify-between text-sm">
            <span>Total Users</span>
            <span class="font-semibold">3</span>
          </div>
          <div class="flex justify-between text-sm">
            <span>Active Sessions</span>
            <span class="font-semibold">2</span>
          </div>
        </div>
      </div>

      <div class="rounded-[28px] bg-white p-6 shadow-soft">
        <h2 class="text-lg font-semibold text-[#1A1A2E]">System Settings</h2>
        <p class="mt-2 text-sm text-[#4B4B6B]">Configure platform-wide settings and policies.</p>
        <div class="mt-4 space-y-2">
          <div class="flex justify-between text-sm">
            <span>API Rate Limit</span>
            <span class="font-semibold">1000 req/min</span>
          </div>
          <div class="flex justify-between text-sm">
            <span>Session Timeout</span>
            <span class="font-semibold">24 hours</span>
          </div>
        </div>
      </div>

      <div class="rounded-[28px] bg-white p-6 shadow-soft">
        <h2 class="text-lg font-semibold text-[#1A1A2E]">Audit Logs</h2>
        <p class="mt-2 text-sm text-[#4B4B6B]">Monitor system activity and security events.</p>
        <div class="mt-4 space-y-2">
          <div class="text-sm text-[#4B4B6B]">Recent activities:</div>
          <div class="text-xs space-y-1">
            <div>• User login: officer@astra.com</div>
            <div>• Loan approved: ID #1</div>
            <div>• Customer updated: ID #2</div>
          </div>
        </div>
      </div>

      <div class="rounded-[28px] bg-white p-6 shadow-soft">
        <h2 class="text-lg font-semibold text-[#1A1A2E]">Data Backup</h2>
        <p class="mt-2 text-sm text-[#4B4B6B]">Manage automated backups and data recovery.</p>
        <div class="mt-4 space-y-2">
          <div class="flex justify-between text-sm">
            <span>Last Backup</span>
            <span class="font-semibold">2 hours ago</span>
          </div>
          <div class="flex justify-between text-sm">
            <span>Backup Status</span>
            <span class="font-semibold text-green-600">Healthy</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
