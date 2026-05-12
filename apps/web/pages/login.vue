<script setup lang="ts">
definePageMeta({ layout: 'default' });

useSeoMeta({ title: 'Sign in', description: 'Sign in to Grayprint.' });

// better-auth plugin endpoints aren't reflected in the type returned by useAuthClient
// without extra inference plumbing. Cast to the runtime-shaped interface.
type AuthClient = {
  signIn: {
    magicLink: (args: { email: string; callbackURL?: string }) => Promise<unknown>;
    emailOtp: (args: { email: string; otp: string }) => Promise<unknown>;
  };
  emailOtp: {
    sendVerificationOtp: (args: { email: string; type: string }) => Promise<unknown>;
  };
};
const authClient = useAuthClient() as unknown as AuthClient;
const email = ref('');
const sent = ref(false);
const loading = ref(false);
const error = ref<string | null>(null);

const mode = ref<'magic' | 'otp'>('magic');
const otp = ref('');
const otpSent = ref(false);

async function sendMagic() {
  loading.value = true;
  error.value = null;
  try {
    await authClient.signIn.magicLink({ email: email.value, callbackURL: '/dashboard' });
    sent.value = true;
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Could not send link.';
  } finally {
    loading.value = false;
  }
}

async function requestOtp() {
  loading.value = true;
  error.value = null;
  try {
    await authClient.emailOtp.sendVerificationOtp({ email: email.value, type: 'sign-in' });
    otpSent.value = true;
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Could not send code.';
  } finally {
    loading.value = false;
  }
}

async function verifyOtp() {
  loading.value = true;
  error.value = null;
  try {
    await authClient.signIn.emailOtp({ email: email.value, otp: otp.value });
    await navigateTo('/dashboard');
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Invalid code.';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <main class="bp-grid-paper relative grid min-h-[80vh] place-items-center px-6 py-12">
    <div class="pointer-events-none absolute inset-0 bg-accent-zing opacity-30" aria-hidden="true" />
    <div class="relative w-full max-w-md rounded-2xl border border-ink/10 bg-paper p-8 shadow-pop">
      <div class="flex items-center gap-2">
        <span class="grid h-8 w-8 place-items-center rounded-md bg-ink text-paper">
          <span class="font-mono text-xs font-bold">g</span>
        </span>
        <div class="font-display text-lg font-bold tracking-tight">grayprint</div>
      </div>
      <h1 class="mt-6 font-display text-3xl font-bold tracking-tight">Welcome back</h1>
      <p class="mt-1 text-sm text-ink/60">Sign in with a one-time link or code.</p>

      <div class="mt-6 inline-flex rounded-lg border border-ink/10 bg-paper p-1 text-sm">
        <button
          :class="['rounded-md px-3 py-1.5 transition', mode === 'magic' ? 'bg-ink text-paper' : 'text-ink/60']"
          @click="mode = 'magic'"
        >
          Magic link
        </button>
        <button
          :class="['rounded-md px-3 py-1.5 transition', mode === 'otp' ? 'bg-ink text-paper' : 'text-ink/60']"
          @click="mode = 'otp'"
        >
          One-time code
        </button>
      </div>

      <form v-if="mode === 'magic'" class="mt-6 space-y-3" @submit.prevent="sendMagic">
        <label class="block">
          <span class="font-mono text-[10px] uppercase tracking-widest text-ink/55">email</span>
          <input
            v-model="email"
            type="email"
            required
            class="mt-1 w-full rounded-md border border-ink/15 bg-paper px-3 py-2.5 text-sm outline-none focus:border-blueprint-500"
            placeholder="you@example.com"
          />
        </label>
        <button class="btn-primary w-full" :disabled="loading">
          {{ loading ? 'Sending…' : 'Send magic link' }}
        </button>
        <p v-if="sent" class="text-sm text-blueprint-700">Check your inbox.</p>
        <p v-if="error" class="text-sm text-spark-600">{{ error }}</p>
      </form>

      <form v-else class="mt-6 space-y-3" @submit.prevent="otpSent ? verifyOtp() : requestOtp()">
        <label class="block">
          <span class="font-mono text-[10px] uppercase tracking-widest text-ink/55">email</span>
          <input
            v-model="email"
            type="email"
            required
            :disabled="otpSent"
            class="mt-1 w-full rounded-md border border-ink/15 bg-paper px-3 py-2.5 text-sm outline-none focus:border-blueprint-500 disabled:opacity-50"
            placeholder="you@example.com"
          />
        </label>
        <label v-if="otpSent" class="block">
          <span class="font-mono text-[10px] uppercase tracking-widest text-ink/55">code</span>
          <input
            v-model="otp"
            inputmode="numeric"
            pattern="[0-9]*"
            maxlength="6"
            required
            class="mt-1 w-full rounded-md border border-ink/15 bg-paper px-3 py-2.5 text-center font-mono text-xl tracking-widest outline-none focus:border-blueprint-500"
          />
        </label>
        <button class="btn-primary w-full" :disabled="loading">
          {{ loading ? '…' : otpSent ? 'Verify code' : 'Send 6-digit code' }}
        </button>
        <p v-if="error" class="text-sm text-spark-600">{{ error }}</p>
      </form>

      <div class="mt-6 text-xs text-ink/50">
        By signing in you agree to the
        <NuxtLink to="/docs" class="underline">terms</NuxtLink>.
      </div>
    </div>
  </main>
</template>
