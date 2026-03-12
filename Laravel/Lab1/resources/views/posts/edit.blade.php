<x-layout>

        <x-slot:title>
            Edit Post
        </x-slot>
        
		<main class="mx-auto max-w-7xl px-6 py-10 lg:px-8 lg:py-14">
			

			<section class="mt-8 rounded-[2rem] border border-white/10 bg-slate-900/60 shadow-2xl shadow-slate-950/50 backdrop-blur-xl">
				<div class="border-b border-white/10 px-6 py-5 lg:px-8">
					<p class="text-sm font-medium text-blue-300">Post Form</p>
					<h2 class="mt-1 text-2xl font-semibold tracking-tight text-white">Edit post details</h2>
				</div>

				<div class="px-6 py-6 lg:px-8 lg:py-8">
					<form method="POST" action="{{ route('posts.update', ['id' => $post['id']]) }}" class="space-y-6">
						@csrf
                        @method('PUT')
						<div>
							<label for="title" class="mb-3 block text-sm font-medium text-slate-200">Title</label>
							<input name="title" id="title" type="text" value="{{ $post->title }}" class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-blue-400/50 focus:ring-4 focus:ring-blue-400/10">
						</div>

						<div>
							<label for="description" class="mb-3 block text-sm font-medium text-slate-200">Description</label>
							<textarea name="description" id="description" rows="6" class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-blue-400/50 focus:ring-4 focus:ring-blue-400/10">{{ $post->description }}</textarea>
						</div>

						<div>
							<label for="creator" class="mb-3 block text-sm font-medium text-slate-200">Post Creator</label>
							<select name="user_id" id="creator" class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-blue-400/50 focus:ring-4 focus:ring-blue-400/10">
								@foreach ($creators as $creator)
								    <option class="bg-slate-900 px-4 py-3 text-white" value="{{ $creator->id }}" {{ $post->user_id == $creator->id ? 'selected' : '' }}>{{ $creator->name }}</option>
                                @endforeach
							</select>       
						</div>

						<div class="flex flex-wrap items-center gap-4 pt-2">
							<button type="submit" class="inline-flex items-center justify-center rounded-2xl bg-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-900/30 transition hover:-translate-y-0.5 hover:bg-blue-400">
								Update
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
