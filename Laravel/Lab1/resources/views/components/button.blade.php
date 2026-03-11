@props([
    'href' => null,
    'type' => 'button',
    'variant' => 'primary',
])

@php
    $variants = [
        'primary' => 'bg-emerald-500 text-white shadow-lg shadow-emerald-900/30 hover:-translate-y-0.5 hover:bg-emerald-400',
        'view' => 'border border-cyan-400/30 bg-cyan-400/10 text-cyan-200 hover:bg-cyan-400/20',
        'edit' => 'border border-blue-400/30 bg-blue-400/10 text-blue-200 hover:bg-blue-400/20',
        'delete' => 'border border-rose-400/30 bg-rose-400/10 text-rose-200 hover:bg-rose-400/20',
        'ghost' => 'border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10',
    ];

    $baseClasses = 'inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold transition';
    $buttonClasses = $baseClasses.' '.($variants[$variant] ?? $variants['primary']);
@endphp

@if ($href)
    <a href="{{ $href }}" class="{{ $buttonClasses }}">
        {{ $slot }}
    </a>
@else
    <button type="{{ $type }}" class="{{ $buttonClasses }}">
        {{ $slot }}
    </button>
@endif