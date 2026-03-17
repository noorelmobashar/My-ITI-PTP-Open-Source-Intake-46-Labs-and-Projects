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

				<section class="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
					<article class="rounded-[2rem] border border-white/10 bg-slate-900/60 shadow-2xl shadow-slate-950/50 backdrop-blur-xl">
						<div class="border-b border-white/10 px-6 py-5 lg:px-8">
							<p class="text-sm font-medium text-emerald-300">Add Comment</p>
							<h2 class="mt-1 text-2xl font-semibold tracking-tight text-white">Share your thoughts</h2>
						</div>

						<div class="px-6 py-6 lg:px-8 lg:py-8">
							<form method="POST" action="{{ route('posts.comments.store', ['slug' => $post->slug]) }}" class="space-y-6">
								@csrf

								<div>
									<label for="content" class="mb-3 block text-sm font-medium text-slate-200">Comment</label>
									<textarea id="content" name="content" rows="5" class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400/50 focus:ring-4 focus:ring-emerald-400/10">{{ old('content') }}</textarea>
									@error('content')
										<p class="mt-2 text-sm text-red-500">{{ $message }}</p>
									@enderror
								</div>

								<div>
									<label for="commenter" class="mb-3 block text-sm font-medium text-slate-200">Comment Creator</label>
									<select id="commenter" name="user_id" class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-emerald-400/50 focus:ring-4 focus:ring-emerald-400/10">
										@foreach ($commenters as $commenter)
											<option class="bg-slate-900 px-4 py-3 text-white" value="{{ $commenter->id }}" @selected(old('user_id') == $commenter->id)>{{ $commenter->name }}</option>
										@endforeach
									</select>
									@error('user_id')
										<p class="mt-2 text-sm text-red-500">{{ $message }}</p>
									@enderror
								</div>

								<div class="flex flex-wrap items-center gap-4 pt-2">
									<button type="submit" class="inline-flex items-center justify-center rounded-2xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-900/30 transition hover:-translate-y-0.5 hover:bg-emerald-400">
										Add Comment
									</button>
								</div>
							</form>
						</div>
					</article>

					<article class="rounded-[2rem] border border-white/10 bg-slate-900/60 shadow-2xl shadow-slate-950/50 backdrop-blur-xl">
						<div class="border-b border-white/10 px-6 py-5 lg:px-8">
							<p class="text-sm font-medium text-amber-300">Comments</p>
							<h2 class="mt-1 text-2xl font-semibold tracking-tight text-white">Post discussion</h2>
						</div>

						<div class="grid gap-4 px-6 py-6 lg:px-8 lg:py-8">
							@forelse ($post->comments as $comment)
								<div class="rounded-3xl border border-white/10 bg-white/5 p-6">
									<div class="flex flex-wrap items-center justify-between gap-3">
										<p class="text-lg font-semibold text-white">{{ $comment->user->name }}</p>
										<p class="text-sm text-slate-400">{{ $comment->created_at->format('Y-m-d h:i A') }}</p>
									</div>
									<p class="mt-4 text-base leading-8 text-slate-300">{{ $comment->content }}</p>
								</div>
							@empty
								<div class="rounded-3xl border border-dashed border-white/10 bg-white/5 p-6 text-slate-400">
									No comments yet.
								</div>
							@endforelse
						</div>
					</article>
				</section>
			</section>
		</main>

</x-layout>
