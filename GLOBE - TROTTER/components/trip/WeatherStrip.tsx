'use client';

import { useEffect, useState } from 'react';
import { CloudSun, Droplets, Wind, Loader2, Sparkles } from 'lucide-react';
import { fetchWeatherForecast, WeatherDay, geocodeCity } from '@/lib/api/openApis';

interface WeatherStripProps {
  cityName: string;
  lat?: number;
  lng?: number;
}

export function WeatherStrip({ cityName, lat, lng }: WeatherStripProps) {
  const [weatherDays, setWeatherDays] = useState<WeatherDay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadWeather() {
      setLoading(true);
      let targetLat = lat;
      let targetLng = lng;

      if (!targetLat || !targetLng) {
        const geo = await geocodeCity(cityName);
        targetLat = geo.lat;
        targetLng = geo.lng;
      }

      const data = await fetchWeatherForecast(targetLat, targetLng);
      if (isMounted) {
        setWeatherDays(data);
        setLoading(false);
      }
    }

    loadWeather();
    return () => {
      isMounted = false;
    };
  }, [cityName, lat, lng]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/95 backdrop-blur-md p-4 shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3">
        <div className="flex items-center gap-2">
          <CloudSun size={16} className="text-amber-500" />
          <h4 className="text-xs font-bold text-slate-800">
            Live Weather in {cityName}
          </h4>
          <span className="rounded bg-emerald-50 text-emerald-700 text-[9px] font-bold px-1.5 py-0.5 border border-emerald-200">
            Open-Meteo
          </span>
        </div>
        <span className="text-[10px] text-slate-400 font-medium">5-Day Forecast</span>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-4 text-xs text-slate-400 gap-2">
          <Loader2 size={14} className="animate-spin text-blue-600" />
          <span>Fetching live weather forecast...</span>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {weatherDays.map((day, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-slate-50/80 border border-slate-100 text-center hover:border-blue-200 transition"
            >
              <span className="text-[10px] font-bold text-slate-500">
                {idx === 0 ? 'Today' : idx === 1 ? 'Tomorrow' : `Day ${idx + 1}`}
              </span>
              <span className="text-xl my-1">{day.icon}</span>
              <div className="flex items-baseline gap-1 font-mono">
                <span className="text-xs font-black text-slate-900">{day.tempMax}°</span>
                <span className="text-[10px] text-slate-400">{day.tempMin}°</span>
              </div>
              <span className="text-[9px] text-slate-500 font-medium truncate w-full mt-0.5">
                {day.condition}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
