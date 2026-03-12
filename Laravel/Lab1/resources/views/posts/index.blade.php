<x-layout>

        <x-slot:title>
            Posts
        </x-slot>
        
		<main class="mx-auto max-w-7xl px-6 py-10 lg:px-8 lg:py-14">
			<section class="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
				<div class="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-cyan-950/20 backdrop-blur-xl">
					<span class="inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">
						Content Management
					</span>

					<div class="mt-5 space-y-4">
						<h1 class="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
							All posts in one clean, modern dashboard.
						</h1>
						<p class="max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
							A polished posts index with create, view, edit, delete, formatted dates, and pagination-ready layout using only Blade, HTML, CSS, and Tailwind.
						</p>
					</div>

					<div class="mt-8 flex flex-wrap items-center gap-4">
						<x-button href="{{ route('posts.create') }}">
							Create Post
						</x-button>
					</div>
				</div>

				<div class="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
					<div class="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
						<p class="text-sm text-slate-400">Total Posts</p>
						<p class="mt-3 text-3xl font-semibold text-white">{{ $posts->total() }}</p>
					</div>

					<div class="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
						<p class="text-sm text-slate-400">Current Page</p>
						<p class="mt-3 text-lg font-semibold text-emerald-300">{{ $posts->currentPage() }} / {{ $posts->lastPage() }}</p>
					</div>

					<div class="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
						<p class="text-sm text-slate-400">Showing</p>
						<p class="mt-3 text-lg font-semibold text-fuchsia-300">{{ $posts->firstItem() ?? 0 }} - {{ $posts->lastItem() ?? 0 }}</p>
					</div>
				</div>
			</section>

			<section class="mt-8 rounded-[2rem] border border-white/10 bg-slate-900/60 shadow-2xl shadow-slate-950/50 backdrop-blur-xl">
				<div class="flex flex-col gap-4 border-b border-white/10 px-6 py-5 sm:flex-row sm:items-center sm:justify-between lg:px-8">
					<div>
						<p class="text-sm font-medium text-cyan-300">Posts Listing</p>
						<h2 class="mt-1 text-2xl font-semibold tracking-tight text-white">Manage all blog posts</h2>
					</div>

				</div>

				<div class="hidden overflow-x-auto lg:block">
					<table class="min-w-full divide-y divide-white/10">
						<thead>
							<tr class="text-left text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
								<th class="px-8 py-5">#</th>
								<th class="px-8 py-5">Title</th>
								<th class="px-8 py-5">Posted By</th>
								<th class="px-8 py-5">Created At</th>
								<th class="px-8 py-5 text-right">Actions</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-white/10 text-sm text-slate-200">
                            @foreach ($posts as $post)
                                
                                <tr class="transition hover:bg-white/[0.03]">
                                    <td class="px-8 py-5 font-semibold text-white">{{ $post->id }}</td>
                                    <td class="px-8 py-5">
                                        <div class="font-medium text-white">{{ $post->title }}</div>
                                    </td>
                                    <td class="px-8 py-5 text-slate-300">{{ $post->user->name }}</td>
                                    <td class="px-8 py-5 text-slate-300">{{ $post->created_at->format('Y-m-d') }}</td>
                                    <td class="px-8 py-5">
                                        <div class="flex justify-end gap-2">
											<x-button href="{{ route('posts.show', ['id' => $post->id]) }}" variant="view" class="rounded-xl px-4 py-2">
												View
											</x-button>
											<x-button href="{{ route('posts.edit', ['id' => $post->id]) }}" variant="edit" class="rounded-xl px-4 py-2">
												Edit
											</x-button>
                                            <form method="POST" action="{{ route('posts.destroy', ['id' => $post->id]) }}" onsubmit="return confirm('Are you sure you want to delete this post?');">
                                                @csrf
                                                @method('DELETE')
                                                <x-button type="submit" variant="delete" class="rounded-xl px-4 py-2">
                                                    Delete
                                                </x-button>
                                            </form>

                                        </div>
                                    </td>
                                </tr>
                            @endforeach
						</tbody>
					</table>
				</div>

				<div class="border-t border-white/10 px-6 py-5 lg:px-8">
					<div class="flex flex-col gap-4 text-sm text-slate-300 sm:flex-row sm:items-center sm:justify-between">
						<div>
							{{ $posts->onEachSide(1)->links() }}
						</div>
					</div>
				</div>
			</section>
		</main>

</x-layout>