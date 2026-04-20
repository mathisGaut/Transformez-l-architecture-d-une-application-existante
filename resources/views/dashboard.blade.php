<x-layouts.app :title="__('Dashboard')">
    <div class="flex max-w-2xl flex-col gap-6">
        <div>
            <flux:heading size="xl">{{ __('Renote') }}</flux:heading>
            <flux:text class="mt-2 text-zinc-600 dark:text-zinc-400">
                {{ __('Les notes et les tags sont gérés dans l’application React connectée à l’API REST (Sanctum). Utilise les boutons ci-dessous ou le menu.') }}
            </flux:text>
        </div>

        <div class="flex flex-wrap gap-3">
            <flux:button variant="primary" :href="url('/app/login')" tag="a">
                {{ __('Connexion SPA') }}
            </flux:button>
            <flux:button variant="filled" :href="url('/app/notes')" tag="a">
                {{ __('Notes') }}
            </flux:button>
            <flux:button variant="filled" :href="url('/app/tags')" tag="a">
                {{ __('Tags') }}
            </flux:button>
        </div>

        <flux:callout variant="neutral" icon="information-circle">
            {{ __('La session web Laravel (cookie) et le token API (SPA) sont distincts : connecte-toi sur /app/login pour utiliser l’interface React.') }}
        </flux:callout>
    </div>
</x-layouts.app>
