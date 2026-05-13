<script setup lang="ts">
const route = useRoute();

const nav = [
  { to: '/templates', label: 'Templates' },
  { to: '/categories', label: 'Categories' },
  { to: '/docs', label: 'Docs' },
];

type SessionUser = { id: string; email: string; name?: string | null };
const session = useSession() as unknown as {
  value?: { data?: { user?: SessionUser } } | null;
};

const user = computed<SessionUser | null>(() => session?.value?.data?.user ?? null);

const initial = computed(() => {
  const u = user.value;
  if (!u) return '';
  const source = u.name?.trim() || u.email;
  return source.charAt(0).toUpperCase();
});

const isHome = computed(() => route.path === '/');

const menuOpen = ref(false);
const menuRef = ref<HTMLElement | null>(null);
const signOut = useSignOut();
const signingOut = ref(false);

function toggleMenu() {
  menuOpen.value = !menuOpen.value;
}

function closeMenu() {
  menuOpen.value = false;
}

async function onSignOut() {
  if (signingOut.value) return;
  signingOut.value = true;
  closeMenu();
  try {
    await signOut('/');
  } finally {
    signingOut.value = false;
  }
}

function onDocumentClick(event: MouseEvent) {
  if (!menuOpen.value) return;
  const target = event.target as Node | null;
  if (target && menuRef.value && !menuRef.value.contains(target)) {
    closeMenu();
  }
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && menuOpen.value) closeMenu();
}

onMounted(() => {
  document.addEventListener('mousedown', onDocumentClick);
  document.addEventListener('keydown', onKeydown);
});

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', onDocumentClick);
  document.removeEventListener('keydown', onKeydown);
});

watch(() => route.fullPath, closeMenu);
</script>

<template>
  <header
    :class="[
      'sticky top-0 z-40 border-b backdrop-blur-md transition-colors',
      'border-ink/10 dark:border-paper/10',
      isHome
        ? 'bg-paper/70 dark:bg-ink/70'
        : 'bg-paper/90 dark:bg-ink/85',
    ]"
  >
    <div class="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-3.5">
      <NuxtLink to="/" class="-mx-1 rounded-md p-1 transition hover:opacity-90">
        <Logo size="md" />
      </NuxtLink>

      <nav class="hidden items-center gap-0.5 sm:flex">
        <NuxtLink
          v-for="item in nav"
          :key="item.to"
          :to="item.to"
          class="relative rounded-md px-3 py-1.5 text-sm text-ink/65 transition hover:text-ink dark:text-paper/65 dark:hover:text-paper"
          active-class="text-ink dark:text-paper"
        >
          {{ item.label }}
          <span
            v-if="route.path.startsWith(item.to)"
            class="absolute inset-x-3 -bottom-px h-px bg-ink dark:bg-paper"
            aria-hidden="true"
          />
        </NuxtLink>
      </nav>

      <div class="flex items-center gap-1.5">
        <NuxtLink
          to="/search"
          aria-label="Search"
          class="hidden items-center gap-2 rounded-pill border border-ink/10 bg-paper/60 px-3 py-1.5 text-xs text-ink/55 transition hover:border-ink/20 hover:text-ink/80 dark:border-paper/15 dark:bg-ink/40 dark:text-paper/55 dark:hover:border-paper/25 dark:hover:text-paper/80 sm:inline-flex"
        >
          <Icon name="lucide:search" class="h-3.5 w-3.5" />
          <span>Search…</span>
          <kbd class="rounded border border-ink/15 px-1 font-mono text-[10px] dark:border-paper/20">⌘K</kbd>
        </NuxtLink>
        <ColorModeToggle />
        <ClientOnly>
          <template v-if="user">
            <div ref="menuRef" class="relative">
              <button
                type="button"
                aria-label="Account"
                aria-haspopup="menu"
                :aria-expanded="menuOpen"
                data-testid="account-menu-trigger"
                class="inline-flex items-center gap-1.5 rounded-pill border border-ink/10 bg-paper/60 py-1 pl-1 pr-2 text-sm text-ink/80 transition hover:border-ink/20 hover:text-ink dark:border-paper/15 dark:bg-ink/40 dark:text-paper/80 dark:hover:border-paper/25 dark:hover:text-paper"
                @click="toggleMenu"
              >
                <span
                  class="grid h-6 w-6 place-items-center rounded-pill bg-ink font-mono text-[11px] font-semibold text-paper dark:bg-paper dark:text-ink"
                  aria-hidden="true"
                >{{ initial }}</span>
                <Icon
                  name="lucide:chevron-down"
                  :class="['h-3.5 w-3.5 transition-transform', menuOpen ? 'rotate-180' : '']"
                  aria-hidden="true"
                />
              </button>

              <Transition
                enter-active-class="transition duration-150 ease-out"
                enter-from-class="opacity-0 -translate-y-1"
                enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition duration-100 ease-in"
                leave-from-class="opacity-100"
                leave-to-class="opacity-0"
              >
                <div
                  v-if="menuOpen"
                  role="menu"
                  aria-label="Account menu"
                  class="absolute right-0 top-[calc(100%+8px)] w-60 overflow-hidden rounded-lg border border-ink/10 bg-paper shadow-pop dark:border-paper/10 dark:bg-ink"
                >
                  <div class="border-b border-ink/10 px-3 py-2.5 dark:border-paper/10">
                    <div class="font-mono text-[10px] uppercase tracking-widest text-ink/50 dark:text-paper/50">Signed in</div>
                    <div class="mt-0.5 truncate text-sm text-ink dark:text-paper">{{ user.email }}</div>
                  </div>
                  <div class="py-1">
                    <NuxtLink
                      to="/dashboard"
                      role="menuitem"
                      class="flex items-center gap-2 px-3 py-2 text-sm text-ink/80 transition hover:bg-ink/5 hover:text-ink dark:text-paper/80 dark:hover:bg-paper/10 dark:hover:text-paper"
                      @click="closeMenu"
                    >
                      <Icon name="lucide:layout-dashboard" class="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Dashboard</span>
                    </NuxtLink>
                    <button
                      type="button"
                      role="menuitem"
                      data-testid="signout"
                      :disabled="signingOut"
                      class="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-ink/80 transition hover:bg-ink/5 hover:text-ink disabled:cursor-not-allowed disabled:opacity-60 dark:text-paper/80 dark:hover:bg-paper/10 dark:hover:text-paper"
                      @click="onSignOut"
                    >
                      <Icon name="lucide:log-out" class="h-3.5 w-3.5" aria-hidden="true" />
                      <span>{{ signingOut ? 'Signing out…' : 'Sign out' }}</span>
                    </button>
                  </div>
                </div>
              </Transition>
            </div>
          </template>
          <template v-else>
            <NuxtLink to="/login" class="btn-ghost text-sm">Sign in</NuxtLink>
            <NuxtLink to="/templates" class="btn-accent text-sm">
              <span>Browse</span>
              <Icon name="lucide:arrow-right" class="h-3.5 w-3.5" />
            </NuxtLink>
          </template>

          <template #fallback>
            <NuxtLink to="/templates" class="btn-accent text-sm">
              <span>Browse</span>
              <Icon name="lucide:arrow-right" class="h-3.5 w-3.5" />
            </NuxtLink>
          </template>
        </ClientOnly>
      </div>
    </div>
  </header>
</template>
