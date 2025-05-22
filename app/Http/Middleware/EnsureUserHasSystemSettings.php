<?php

namespace App\Http\Middleware;

use App\Models\SystemSetting;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasSystemSettings
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (Auth::check()) {
            $userId = Auth::id();

            $existingSettings = SystemSetting::where('user_id', $userId)->first();

            if (!$existingSettings) {
                SystemSetting::create([
                    'name' => "Default Quiz Settings - User {$userId}",
                    'question_order' => 'sequential',
                    'display_format' => 'one_per_page',
                    'show_question_number' => true,
                    'visible_timer' => true,
                    'question_required' => true,
                    'show_correct_answers' => 'after_quiz',
                    'passing_threshold' => 70,
                    'time_duration' => 900,
                    'max_attempts' => null,
                    'user_id' => $userId,
                ]);
            }
        }

        return $next($request);
    }
}
