"use client";

import { useState } from "react";

export default function RefreshButton() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const triggerScraper = async() => {
        setStatus('loading');

        try {
            const result = await fetch('/api/trigger-scraper', {method: 'POST'});

            if (result.ok) {
                setStatus('success');

                // Reset to idle after 5 seconds
                setTimeout(() => setStatus('idle'), 5000);
            } else {
                setStatus('error');
            }
        } catch (error) {
            setStatus('error');
        }
    };

    return (
        <div className="flex flex-col items-start gap-2">
            <button 
                onClick={triggerScraper}
                disabled={status === 'loading'}
                className={`px-4 py-2 roudned font-medium transition-colors ${
                    status === 'loading' ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
            >
                {status === 'loading' ? '⚙️ Scraper Running...' : '🔄 Refresh Data'};
            </button>

            {status === 'success' && (
                <p className="text-sm text-green-600 font-medium">
                    Action triggered! Data will be update soon~.
                </p>
            )}
        </div>
    )
}