<x-layout>

        <x-slot:title>
            Post Details
        </x-slot>

		<main class="mx-auto max-w-7xl px-6 py-10 lg:px-8 lg:py-14">

			<section class="mt-8 grid gap-6">
				<article class="rounded-[2rem] border border-white/10 bg-slate-900/60 shadow-2xl shadow-slate-950/50 backdrop-blur-xl">
					<div class="border-b border-white/10 px-6 py-5 lg:px-8">
						<p class="text-sm font-medium text-fuchsia-300">Post Info</p>
						<h2 class="mt-1 text-2xl font-semibold tracking-tight text-white">Article overview</h2>
					</div>
					
					<div class="grid gap-6 px-6 py-6 lg:px-8 lg:py-8">
						<div class="rounded-3xl border border-white/10 bg-white/5 p-6">
							<p class="text-xs uppercase tracking-[0.24em] text-slate-500">Title</p>
							<h3 class="mt-3 text-2xl font-semibold text-white">{{ $post->title }}</h3>
						</div>

						<div class="rounded-3xl border border-white/10 bg-white/5 p-6">
							<p class="text-xs uppercase tracking-[0.24em] text-slate-500">Description</p>
							<p class="mt-3 max-w-3xl text-base leading-8 text-slate-300">
                                {{ $post->description }}
							</p>
						</div>
					</div>
					<div class="px-6 py-6 lg:px-8 lg:py-8">
						@if ($post->image)
							<img src="{{ asset('storage/' . $post->image) }}" alt="Post Image" class="w-full rounded-2xl border border-white/10 bg-white/5 object-cover">
						@endif
					</div>
				</article>

				<article class="rounded-[2rem] border border-white/10 bg-slate-900/60 shadow-2xl shadow-slate-950/50 backdrop-blur-xl">
					<div class="border-b border-white/10 px-6 py-5 lg:px-8">
						<p class="text-sm font-medium text-cyan-300">Post Creator Info</p>
						<h2 class="mt-1 text-2xl font-semibold tracking-tight text-white">Author details</h2>
					</div>

					<div class="grid gap-4 px-6 py-6 lg:px-8 lg:py-8 sm:grid-cols-2 xl:grid-cols-3">
						<div class="rounded-3xl border border-white/10 bg-white/5 p-6">
							<p class="text-xs uppercase tracking-[0.24em] text-slate-500">Name</p>
							<p class="mt-3 text-xl font-semibold text-white">{{$post->user->name}}</p>
						</div>

						<div class="rounded-3xl border border-white/10 bg-white/5 p-6">
							<p class="text-xs uppercase tracking-[0.24em] text-slate-500">Email</p>
							<p class="mt-3 text-xl font-semibold text-white">{{$post->user->email}}</p>
						</div>

						<div class="rounded-3xl border border-white/10 bg-white/5 p-6 sm:col-span-2 xl:col-span-1">
							<p class="text-xs uppercase tracking-[0.24em] text-slate-500">Created At</p>
							<p class="mt-3 text-xl font-semibold text-white">{{$post->created_at->format('l jS \of F Y h:i:s A')}}</p>
						</div>
					</div>
				</article>
			</section>
		</main>

</x-layout>