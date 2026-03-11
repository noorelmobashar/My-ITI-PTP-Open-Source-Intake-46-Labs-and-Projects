<x-layout>

        <x-slot:title>
            Create Post
        </x-slot>
        
		<main class="mx-auto max-w-7xl px-6 py-10 lg:px-8 lg:py-14">
			<section class="grid gap-6 lg:grid-cols-[1.35fr_0.85fr]">
				<div class="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-cyan-950/20 backdrop-blur-xl">
					<span class="inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-200">
						Create New Post
					</span>

					<div class="mt-5 space-y-4">
						<h1 class="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
							Craft a fresh article with a premium editor layout.
						</h1>
						<p class="max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
							A modern post creation screen with elegant spacing, clean form fields, and a strong visual hierarchy.
						</p>
					</div>

					<div class="mt-8 flex flex-wrap items-center gap-4 text-sm text-slate-300">
						<div class="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3">
							<span class="h-2 w-2 rounded-full bg-emerald-400"></span>
							Title, description, and creator selector included
						</div>
						<div class="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3">
							<span class="h-2 w-2 rounded-full bg-cyan-400"></span>
							Static HTML + Tailwind only
						</div>
					</div>
				</div>

				<div class="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
					<div class="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
						<p class="text-sm text-slate-400">Form Type</p>
						<p class="mt-3 text-2xl font-semibold text-white">Create</p>
					</div>

					<div class="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
						<p class="text-sm text-slate-400">Fields</p>
						<p class="mt-3 text-lg font-semibold text-cyan-300">3 Inputs</p>
					</div>

					<div class="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
						<p class="text-sm text-slate-400">Action</p>
						<p class="mt-3 text-lg font-semibold text-emerald-300">Create Post</p>
					</div>
				</div>
			</section>

			<section class="mt-8 rounded-[2rem] border border-white/10 bg-slate-900/60 shadow-2xl shadow-slate-950/50 backdrop-blur-xl">
				<div class="border-b border-white/10 px-6 py-5 lg:px-8">
					<p class="text-sm font-medium text-emerald-300">Post Form</p>
					<h2 class="mt-1 text-2xl font-semibold tracking-tight text-white">Create a new blog post</h2>
				</div>

				<div class="px-6 py-6 lg:px-8 lg:py-8">
					<form method="POST" action="{{ route('posts.store') }}" class="space-y-6">
						@csrf
						<div>
							<label for="title" class="mb-3 block text-sm font-medium text-slate-200">Title</label>
							<input id="title" type="text" placeholder="Enter post title" class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/50 focus:ring-4 focus:ring-cyan-400/10">
						</div>

						<div>
							<label for="description" class="mb-3 block text-sm font-medium text-slate-200">Description</label>
							<textarea id="description" rows="6" placeholder="Write a concise and engaging description..." class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/50 focus:ring-4 focus:ring-cyan-400/10"></textarea>
						</div>

						<div>
							<label for="creator" class="mb-3 block text-sm font-medium text-slate-200">Post Creator</label>
							<select id="creator" class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-cyan-400/50 focus:ring-4 focus:ring-cyan-400/10">
								@foreach ($creators as $creator)
									<option class="bg-slate-900 px-4 py-3 text-white">{{ $creator['name'] }}</option>
								@endforeach
							</select>
						</div>

						<div class="flex flex-wrap items-center gap-4 pt-2">
							<button type="submit" class="inline-flex items-center justify-center rounded-2xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-900/30 transition hover:-translate-y-0.5 hover:bg-emerald-400">
								Create
							</button>
							<a href={{ route('posts.index') }} class="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10">
								Cancel
							</a>
						</div>
					</form>
				</div>
			</section>
		</main>
</x-layout>
