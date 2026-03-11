<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>{{ $title ?? 'Posts' }}</title>
	@vite(['resources/css/app.css', 'resources/js/app.js',])
</head>
<body class="min-h-screen bg-slate-950 text-slate-100">
	<div class="relative isolate overflow-hidden">
		<div class="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_28%),radial-gradient(circle_at_80%_20%,_rgba(168,85,247,0.18),_transparent_24%),linear-gradient(180deg,_#020617_0%,_#0f172a_45%,_#111827_100%)]"></div>

		<header class="border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
			<div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
				<div class="flex items-center gap-8">
					<a href="#" class="text-xl font-semibold tracking-tight text-white">ITI Blog</a>
					<nav class="hidden items-center gap-6 text-sm text-slate-300 md:flex">
						<a href={{ route('posts.index') }} class="transition hover:text-white">Dashboard</a>
					</nav>
				</div>

			</div>
		</header>

        {{ $slot }}

    </div>
</body>
</html>