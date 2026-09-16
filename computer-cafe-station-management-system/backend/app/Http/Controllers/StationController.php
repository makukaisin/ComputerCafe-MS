<?php

namespace App\Http\Controllers;

use App\Models\Station;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class StationController extends Controller
{
    public function index(): JsonResponse
    {
        $stations = Station::query()
            ->latest('id')
            ->get();

        return response()->json([
            'data' => $stations,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'station_name' => ['required', 'string', 'max:100'],
            'pc_number' => [
                'required',
                'string',
                'max:50',
                'unique:stations,pc_number'
            ],
            'tier' => [
                'required',
                Rule::in([
                    'Regular',
                    'VIP',
                    'Streaming Room'
                ])
            ],
            'hourly_rate' => [
                'required',
                'numeric',
                'min:0',
                'max:99999.99'
            ],
        ], [
            'station_name.required' => 'Station Name is required.',
            'pc_number.required' => 'PC Number is required.',
            'pc_number.unique' => 'That PC Number is already registered.',
            'tier.required' => 'Tier/Category is required.',
            'tier.in' => 'Choose Regular, VIP, or Streaming Room.',
            'hourly_rate.required' => 'Hourly Rate is required.',
            'hourly_rate.numeric' => 'Hourly Rate must be a valid number.',
        ]);

        $station = Station::create($validated);

        return response()->json([
            'message' => 'Station created successfully.',
            'data' => $station,
        ], 201);
    }

    public function show(Station $station): JsonResponse
    {
        return response()->json([
            'data' => $station,
        ]);
    }
}